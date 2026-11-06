import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import {
  StockMovementType,
  TaskSourceType,
  TaskStatus,
  type Prisma,
} from '../../generated/prisma/client';

import {
  AUTOMATION_KEYS,
  planBreedingTasks,
  planHealthFollowUpTask,
  planRepalpationTask,
  planStockReorderTask,
  planWeaningTask,
  type AutomationKey,
  type BreedingForPlanning,
  type PlannedTask,
} from './task-planner';
import { computeAutonomy } from './stock-autonomy';

type Db = PrismaService | Prisma.TransactionClient;

const OPEN_STATUSES = [TaskStatus.TODO, TaskStatus.IN_PROGRESS];

/**
 * Génère et clôture automatiquement les tâches liées
 * aux événements métier (§47) :
 *
 *   Accouplement → palpation (J+10), nid (J+28), mise bas (J+30)
 *   Palpation    → clôture / nouvelle palpation / annulation
 *   Naissance    → sevrage (J+35)
 *   Soin         → contrôle à la prochaine échéance
 *   Stock        → réapprovisionnement sous le seuil minimum
 *
 * Toutes les méthodes acceptent un client de transaction
 * pour rester atomiques avec l'événement qui les déclenche.
 */
@Injectable()
export class TaskAutomationService {
  private readonly logger = new Logger(TaskAutomationService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async createTasks(
    farmId: string,
    tasks: PlannedTask[],
    db: Db = this.prisma,
  ) {
    for (const task of tasks) {
      await db.task.create({
        data: {
          farmId,
          title: task.title,
          description: task.description ?? null,
          dueDate: task.dueDate,
          priority: task.priority,
          sourceType: task.sourceType,
          sourceId: task.sourceId,
          rabbitId: task.rabbitId ?? null,
          automationKey: task.automationKey,
        },
      });
    }
  }

  private async closeTasks(
    farmId: string,
    sourceType: TaskSourceType,
    sourceId: string,
    keys: AutomationKey[],
    status: typeof TaskStatus.COMPLETED | typeof TaskStatus.CANCELLED,
    db: Db = this.prisma,
  ) {
    const result = await db.task.updateMany({
      where: {
        farmId,
        sourceType,
        sourceId,
        automationKey: { in: keys },
        status: { in: OPEN_STATUSES },
      },
      data: {
        status,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
      },
    });

    return result.count;
  }

  // ------------------------------------------------------------
  // Reproduction
  // ------------------------------------------------------------

  async onBreedingCreated(
    farmId: string,
    breeding: BreedingForPlanning,
    db: Db = this.prisma,
  ) {
    await this.createTasks(farmId, planBreedingTasks(breeding), db);
  }

  async onPregnancyChecked(
    farmId: string,
    breeding: { id: string; femaleId: string; femaleCode: string },
    result: 'PREGNANT' | 'NOT_PREGNANT' | 'INCONCLUSIVE',
    checkDate: Date,
    db: Db = this.prisma,
  ) {
    await this.closeTasks(
      farmId,
      TaskSourceType.BREEDING,
      breeding.id,
      [AUTOMATION_KEYS.PALPATION],
      TaskStatus.COMPLETED,
      db,
    );

    if (result === 'NOT_PREGNANT') {
      // Femelle vide : nid et mise bas n'ont plus lieu d'être.
      await this.closeTasks(
        farmId,
        TaskSourceType.BREEDING,
        breeding.id,
        [AUTOMATION_KEYS.NEST, AUTOMATION_KEYS.BIRTH],
        TaskStatus.CANCELLED,
        db,
      );
    }

    if (result === 'INCONCLUSIVE') {
      await this.createTasks(
        farmId,
        [planRepalpationTask(breeding, checkDate)],
        db,
      );
    }
  }

  async onNestInstalled(
    farmId: string,
    breedingId: string,
    db: Db = this.prisma,
  ) {
    await this.closeTasks(
      farmId,
      TaskSourceType.BREEDING,
      breedingId,
      [AUTOMATION_KEYS.NEST],
      TaskStatus.COMPLETED,
      db,
    );
  }

  async onBreedingCancelled(
    farmId: string,
    breedingId: string,
    db: Db = this.prisma,
  ) {
    await this.closeTasks(
      farmId,
      TaskSourceType.BREEDING,
      breedingId,
      [AUTOMATION_KEYS.PALPATION, AUTOMATION_KEYS.NEST, AUTOMATION_KEYS.BIRTH],
      TaskStatus.CANCELLED,
      db,
    );
  }

  async onBirthRecorded(
    farmId: string,
    birth: {
      id: string;
      breedingId: string;
      birthDate: Date;
      motherId: string;
      motherCode: string;
      liveBorn: number;
      litterCode?: string | null;
    },
    db: Db = this.prisma,
  ) {
    await this.closeTasks(
      farmId,
      TaskSourceType.BREEDING,
      birth.breedingId,
      [AUTOMATION_KEYS.PALPATION, AUTOMATION_KEYS.NEST, AUTOMATION_KEYS.BIRTH],
      TaskStatus.COMPLETED,
      db,
    );

    if (birth.liveBorn > 0) {
      await this.createTasks(farmId, [planWeaningTask(birth)], db);
    }
  }

  async onWeaningCompleted(
    farmId: string,
    birthId: string | null,
    db: Db = this.prisma,
  ) {
    if (!birthId) return;

    await this.closeTasks(
      farmId,
      TaskSourceType.BIRTH,
      birthId,
      [AUTOMATION_KEYS.WEANING],
      TaskStatus.COMPLETED,
      db,
    );
  }

  // ------------------------------------------------------------
  // Santé
  // ------------------------------------------------------------

  async onHealthRecordCreated(
    farmId: string,
    record: {
      id: string;
      rabbitId: string;
      rabbitCode: string;
      type: string;
      nextDueDate: Date | null;
      treatment?: string | null;
      medication?: string | null;
    },
    db: Db = this.prisma,
  ) {
    if (!record.nextDueDate) return;

    await this.createTasks(
      farmId,
      [
        planHealthFollowUpTask({
          ...record,
          nextDueDate: record.nextDueDate,
        }),
      ],
      db,
    );
  }

  // ------------------------------------------------------------
  // Stock
  // ------------------------------------------------------------

  /**
   * Crée une tâche de réapprovisionnement si l'article passe
   * sous son seuil minimum et qu'aucune tâche n'est déjà ouverte.
   */
  async onStockChanged(
    farmId: string,
    inventoryItemId: string,
    db: Db = this.prisma,
  ) {
    const item = await db.inventoryItem.findFirst({
      where: { id: inventoryItemId, farmId },
      include: {
        movements: {
          where: { type: StockMovementType.CONSUMPTION },
          select: { type: true, quantity: true, date: true },
        },
      },
    });

    if (!item || item.minimumStock == null) return;

    if (item.currentStock > item.minimumStock) {
      // Stock rétabli : la tâche ouverte est considérée comme faite.
      await this.closeTasks(
        farmId,
        TaskSourceType.INVENTORY,
        item.id,
        [AUTOMATION_KEYS.STOCK_REORDER],
        TaskStatus.COMPLETED,
        db,
      );
      return;
    }

    const existing = await db.task.findFirst({
      where: {
        farmId,
        sourceType: TaskSourceType.INVENTORY,
        sourceId: item.id,
        automationKey: AUTOMATION_KEYS.STOCK_REORDER,
        status: { in: OPEN_STATUSES },
      },
      select: { id: true },
    });

    if (existing) return;

    const autonomy = computeAutonomy(item.currentStock, item.movements);

    await this.createTasks(
      farmId,
      [
        planStockReorderTask({
          id: item.id,
          name: item.name,
          unit: item.unit,
          currentStock: item.currentStock,
          minimumStock: item.minimumStock,
          autonomyDays: autonomy.autonomyDays,
        }),
      ],
      db,
    );

    this.logger.log(`Tâche de réapprovisionnement créée pour ${item.name}`);
  }
}
