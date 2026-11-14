import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  StockMovementType,
  TaskPriority,
  TaskStatus,
} from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { CreateExpenseInput } from './inputs/create-expense.input.js';
import { CreateInventoryItemInput } from './inputs/create-inventory-item.input.js';
import { CreateStockMovementInput } from './inputs/create-stock-movement.input.js';
import { CreateTaskInput } from './inputs/create-task.input.js';
import { UpdateTaskInput } from './inputs/update-task.input.js';
import { UpdateExpenseInput } from './inputs/update-expense.input.js';
import { UpdateInventoryItemInput } from './inputs/update-inventory-item.input.js';
import { TaskAutomationService } from './automation/task-automation.service.js';
import { computeAutonomy } from './automation/stock-autonomy.js';
import { startOfDay } from './feeding/feeding-plan.js';

const taskInclude = { rabbit: { select: { code: true } } } as const;

export interface TaskFilters {
  status?: TaskStatus;
  from?: Date;
  to?: Date;
  rabbitId?: string;
  openOnly?: boolean;
}

const INBOUND_MOVEMENTS = new Set<StockMovementType>([
  StockMovementType.INITIAL,
  StockMovementType.PURCHASE,
  StockMovementType.RETURN,
]);

const OUTBOUND_MOVEMENTS = new Set<StockMovementType>([
  StockMovementType.CONSUMPTION,
  StockMovementType.LOSS,
]);

@Injectable()
export class OperationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly automation: TaskAutomationService,
  ) {}

  private mapTask<T extends { rabbit?: { code: string } | null }>(task: T) {
    const { rabbit, ...rest } = task;
    return { ...rest, rabbitCode: rabbit?.code ?? null };
  }

  // ============================================================
  // UTILITAIRES
  // ============================================================

  private toNumber(
    value: { toString(): string } | number | null | undefined,
  ) {
    if (value == null) {
      return null;
    }

    return Number(value);
  }

  private validateDate(date: Date, fieldName: string) {
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        `La date ${fieldName} est invalide.`,
      );
    }
  }

  /**
   * Transforme une quantité en variation de stock.
   *
   * Entrées :
   * INITIAL      + quantité
   * PURCHASE     + quantité
   * RETURN       + quantité
   *
   * Sorties :
   * CONSUMPTION  - quantité
   * LOSS         - quantité
   *
   * ADJUSTMENT :
   * la quantité est signée et représente directement
   * la variation du stock.
   */
  private signedQuantity(
    type: StockMovementType,
    quantity: number,
  ) {
    if (INBOUND_MOVEMENTS.has(type)) {
      return Math.abs(quantity);
    }

    if (OUTBOUND_MOVEMENTS.has(type)) {
      return -Math.abs(quantity);
    }

    return quantity;
  }

  /**
   * Ancienne méthode de calcul historique du stock.
   *
   * Elle reste utile pour contrôler/recalculer un stock
   * à partir des mouvements.
   */
  private currentStock(
    movements: Array<{
      type: StockMovementType;
      quantity: number;
    }>,
  ) {
    return movements.reduce(
      (sum, movement) =>
        sum +
        this.signedQuantity(
          movement.type,
          movement.quantity,
        ),
      0,
    );
  }

  private mapExpense(expense: {
    amount: { toString(): string } | number;
  }) {
    return {
      ...expense,
      amount: this.toNumber(expense.amount) ?? 0,
    };
  }

  private mapMovement(movement: {
    unitCost: { toString(): string } | number | null;
  }) {
    return {
      ...movement,
      unitCost: this.toNumber(movement.unitCost),
    };
  }

  private mapInventoryItem(item: {
    currentStock: number;
    minimumStock: number | null;
    unitPrice?: { toString(): string } | number | null;
    movements?: Array<{
      type: StockMovementType;
      quantity: number;
      date: Date;
      unitCost: { toString(): string } | number | null;
    }>;
  }) {
    const autonomy = computeAutonomy(item.currentStock, item.movements ?? []);

    const unitPrice = this.toNumber(item.unitPrice);

    return {
      ...item,
      unitPrice,
      stockValue:
        unitPrice != null ? Math.round(unitPrice * item.currentStock * 100) / 100 : null,
      currentStock: item.currentStock,
      isBelowMinimum:
        item.minimumStock != null && item.currentStock <= item.minimumStock,
      averageDailyConsumption: autonomy.averageDailyConsumption,
      autonomyDays: autonomy.autonomyDays,
      movements:
        item.movements?.map((movement) =>
          this.mapMovement(movement),
        ) ?? [],
    };
  }

  // ============================================================
  // EXPENSES
  // ============================================================

  async createExpense(
    input: CreateExpenseInput,
    currentUser: CurrentUserType,
  ) {
    if (input.amount <= 0) {
      throw new BadRequestException(
        'Le montant doit être supérieur à zéro.',
      );
    }

    const date = new Date(input.date);

    this.validateDate(date, 'de dépense');

    const expense = await this.prisma.expense.create({
      data: {
        farmId: currentUser.farmId,

        category: input.category,
        amount: input.amount,
        date,

        description:
          input.description?.trim() || null,

        reference:
          input.reference?.trim() || null,

        supplier:
          input.supplier?.trim() || null,
        paymentMethod: input.paymentMethod ?? null,
        observation:
          input.observation?.trim() || null,
      },
    });

    return this.mapExpense(expense);
  }

  async expenses(currentUser: CurrentUserType) {
    const expenses = await this.prisma.expense.findMany({
      where: {
        farmId: currentUser.farmId,
      },

      orderBy: {
        date: 'desc',
      },
    });

    return expenses.map((expense) =>
      this.mapExpense(expense),
    );
  }

  // ============================================================
  // INVENTORY
  // ============================================================

  async createInventoryItem(
    input: CreateInventoryItemInput,
    currentUser: CurrentUserType,
  ) {
    const name = input.name.trim();
    const unit = input.unit.trim();

    if (!name || !unit) {
      throw new BadRequestException(
        'Le nom et l’unité de l’article sont obligatoires.',
      );
    }

    if (
      input.minimumStock != null &&
      input.minimumStock < 0
    ) {
      throw new BadRequestException(
        'Le stock minimum ne peut pas être négatif.',
      );
    }

    if (input.unitPrice != null && input.unitPrice < 0) {
      throw new BadRequestException('Le prix unitaire ne peut pas être négatif.');
    }

    const existing =
      await this.prisma.inventoryItem.findUnique({
        where: {
          farmId_name: {
            farmId: currentUser.farmId,
            name,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Cet article existe déjà.',
      );
    }

    if (input.initialStock != null && input.initialStock < 0) {
      throw new BadRequestException('Le stock initial ne peut pas être négatif.');
    }
    const initialDate = input.initialStockDate ? new Date(input.initialStockDate) : new Date();
    this.validateDate(initialDate, 'du stock initial');
    const initialStock = input.initialStock ?? 0;

    const item = await this.prisma.$transaction(async (tx) => {
      const created = await tx.inventoryItem.create({
        data: {
          farmId: currentUser.farmId,
          name,
          type: input.type,
          unit,
          minimumStock: input.minimumStock,
          unitPrice: input.unitPrice ?? null,
          currentStock: initialStock,
          // Les rations journalières se calculent à partir du stock initial.
          rationsAppliedUntil: initialStock > 0 ? startOfDay(initialDate) : null,
          description: input.description?.trim() || null,
        },
      });
      if (initialStock > 0) {
        await tx.stockMovement.create({
          data: {
            inventoryItemId: created.id,
            type: StockMovementType.INITIAL,
            quantity: initialStock,
            date: initialDate,
            unitCost: input.unitPrice ?? null,
            description: 'Stock initial',
          },
        });
      }
      return tx.inventoryItem.findUniqueOrThrow({
        where: { id: created.id },
        include: { movements: true },
      });
    });

    return this.mapInventoryItem(item);
  }

  async inventoryItems(
    currentUser: CurrentUserType,
  ) {
    const items =
      await this.prisma.inventoryItem.findMany({
        where: {
          farmId: currentUser.farmId,
        },

        include: {
          movements: {
            orderBy: {
              date: 'desc',
            },
          },
        },

        orderBy: {
          name: 'asc',
        },
      });

    return items.map((item) =>
      this.mapInventoryItem(item),
    );
  }

  async findInventoryItem(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const item =
      await this.prisma.inventoryItem.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },

        include: {
          movements: {
            orderBy: {
              date: 'desc',
            },
          },
        },
      });

    if (!item) {
      throw new NotFoundException(
        'Article de stock introuvable.',
      );
    }

    return this.mapInventoryItem(item);
  }

  // ============================================================
  // STOCK MOVEMENTS
  // ============================================================

  async createStockMovement(
    input: CreateStockMovementInput,
    currentUser: CurrentUserType,
  ) {
    const date = new Date(input.date);

    this.validateDate(date, 'de mouvement');

    if (input.quantity === 0) {
      throw new BadRequestException(
        'La quantité ne peut pas être nulle.',
      );
    }

    /**
     * Tous les mouvements sauf ADJUSTMENT
     * doivent avoir une quantité positive.
     */
    if (
      input.type !== StockMovementType.ADJUSTMENT &&
      input.quantity < 0
    ) {
      throw new BadRequestException(
        'La quantité doit être positive, sauf pour un ajustement.',
      );
    }

    if (
      input.unitCost != null &&
      input.unitCost < 0
    ) {
      throw new BadRequestException(
        'Le coût unitaire est invalide.',
      );
    }

    /**
     * On utilise une transaction afin que :
     *
     * 1. le mouvement soit créé
     * 2. currentStock soit mis à jour
     *
     * ou que les deux opérations soient annulées.
     */
    return this.prisma.$transaction(async (tx) => {
      const item =
        await tx.inventoryItem.findFirst({
          where: {
            id: input.inventoryItemId,
            farmId: currentUser.farmId,
          },
        });

      if (!item) {
        throw new NotFoundException(
          'Article de stock introuvable.',
        );
      }

      const delta = this.signedQuantity(
        input.type,
        input.quantity,
      );

      const nextStock =
        item.currentStock + delta;

      if (nextStock < 0) {
        throw new BadRequestException(
          'Le stock ne peut pas devenir négatif.',
        );
      }

      /**
       * Création de l'historique du mouvement.
       */
      const movement =
        await tx.stockMovement.create({
          data: {
            inventoryItemId: item.id,

            type: input.type,

            quantity: input.quantity,

            date,

            unitCost: input.unitCost,

            reference:
              input.reference?.trim() || null,

            description:
              input.description?.trim() || null,
          },
        });

      /**
       * Mise à jour du stock courant.
       */
      await tx.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          currentStock: nextStock,
          // Un achat avec un coût unitaire met à jour le prix de référence.
          ...(input.unitCost != null &&
          (input.type === StockMovementType.PURCHASE ||
            input.type === StockMovementType.INITIAL)
            ? { unitPrice: input.unitCost }
            : {}),
        },
      });

      // Alerte / tâche de réapprovisionnement si besoin.
      await this.automation.onStockChanged(currentUser.farmId, item.id, tx);

      return this.mapMovement(movement);
    });
  }

  // ============================================================
  // TASKS
  // ============================================================

  async createTask(
    input: CreateTaskInput,
    currentUser: CurrentUserType,
  ) {
    const title = input.title.trim();

    if (!title) {
      throw new BadRequestException(
        'Le titre de la tâche est obligatoire.',
      );
    }

    const dueDate = new Date(input.dueDate);

    this.validateDate(
      dueDate,
      'd’échéance',
    );

    /**
     * Vérification de l'utilisateur assigné.
     */
    if (input.assignedToId) {
      const membership =
        await this.prisma.farmMembership.findFirst({
          where: {
            farmId: currentUser.farmId,
            userId: input.assignedToId,
          },
        });

      if (!membership) {
        throw new BadRequestException(
          'L’utilisateur assigné n’appartient pas à cette ferme.',
        );
      }
    }

    /**
     * Si la tâche est liée à un lapin,
     * le lapin doit appartenir à la même ferme.
     */
    if (input.rabbitId) {
      const rabbit =
        await this.prisma.rabbit.findFirst({
          where: {
            id: input.rabbitId,
            farmId: currentUser.farmId,
          },
        });

      if (!rabbit) {
        throw new BadRequestException(
          'Le lapin associé à la tâche est introuvable dans cette ferme.',
        );
      }
    }

    /**
     * Si sourceId est fourni sans sourceType,
     * cela n'a pas beaucoup de sens.
     */
    if (
      input.sourceId &&
      !input.sourceType
    ) {
      throw new BadRequestException(
        'sourceType est obligatoire lorsqu’un sourceId est fourni.',
      );
    }

    const created = await this.prisma.task.create({
      include: taskInclude,
      data: {
        farmId: currentUser.farmId,

        title,

        description:
          input.description?.trim() || null,

        dueDate,

        priority:
          input.priority ??
          TaskPriority.MEDIUM,

        assignedToId:
          input.assignedToId || null,

        sourceType:
          input.sourceType ?? null,

        sourceId:
          input.sourceId || null,

        rabbitId:
          input.rabbitId || null,
      },
    });

    return this.mapTask(created);
  }

  async tasks(
    currentUser: CurrentUserType,
    filters: TaskFilters = {},
  ) {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId: currentUser.farmId,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.openOnly
          ? { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } }
          : {}),
        ...(filters.rabbitId ? { rabbitId: filters.rabbitId } : {}),
        ...(filters.from || filters.to
          ? {
              dueDate: {
                ...(filters.from ? { gte: filters.from } : {}),
                ...(filters.to ? { lte: filters.to } : {}),
              },
            }
          : {}),
      },
      include: taskInclude,

      orderBy: [
        {
          dueDate: 'asc',
        },
        {
          priority: 'desc',
        },
      ],
    });

    return tasks.map((task) => this.mapTask(task));
  }

  async findTask(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const task =
      await this.prisma.task.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },
        include: taskInclude,
      });

    if (!task) {
      throw new NotFoundException(
        'Tâche introuvable.',
      );
    }

    return this.mapTask(task);
  }

  async updateTask(
    input: UpdateTaskInput,
    currentUser: CurrentUserType,
  ) {
    const task =
      await this.findTask(
        input.id,
        currentUser,
      );

    /**
     * Vérification de l'utilisateur assigné.
     */
    if (input.assignedToId) {
      const membership =
        await this.prisma.farmMembership.findFirst({
          where: {
            farmId: currentUser.farmId,
            userId: input.assignedToId,
          },
        });

      if (!membership) {
        throw new BadRequestException(
          'L’utilisateur assigné n’appartient pas à cette ferme.',
        );
      }
    }

    /**
     * Vérification du lapin associé.
     */
    if (input.rabbitId) {
      const rabbit =
        await this.prisma.rabbit.findFirst({
          where: {
            id: input.rabbitId,
            farmId: currentUser.farmId,
          },
        });

      if (!rabbit) {
        throw new BadRequestException(
          'Le lapin associé à la tâche est introuvable dans cette ferme.',
        );
      }
    }

    /**
     * Validation de la nouvelle date.
     */
    let dueDate: Date | undefined;

    if (input.dueDate) {
      dueDate = new Date(
        input.dueDate,
      );

      this.validateDate(
        dueDate,
        'd’échéance',
      );
    }

    /**
     * completedAt est automatiquement géré
     * selon le statut.
     */
    let completedAt =
      task.completedAt;

    if (
      input.status ===
        TaskStatus.COMPLETED &&
      !task.completedAt
    ) {
      completedAt = new Date();
    }

    if (
      input.status &&
      input.status !==
        TaskStatus.COMPLETED &&
      task.status ===
        TaskStatus.COMPLETED
    ) {
      completedAt = null;
    }

    /**
     * Vérification sourceType/sourceId.
     */
    const finalSourceType =
      input.sourceType ??
      task.sourceType;

    const finalSourceId =
      input.sourceId ??
      task.sourceId;

    if (
      finalSourceId &&
      !finalSourceType
    ) {
      throw new BadRequestException(
        'sourceType est obligatoire lorsqu’un sourceId est fourni.',
      );
    }

    const updated = await this.prisma.task.update({
      include: taskInclude,
      where: {
        id: task.id,
      },

      data: {
        title:
          input.title !== undefined
            ? input.title.trim()
            : undefined,

        description:
          input.description !== undefined
            ? input.description.trim() || null
            : undefined,

        dueDate,

        status: input.status,

        priority: input.priority,

        assignedToId:
          input.assignedToId,

        sourceType:
          input.sourceType,

        sourceId:
          input.sourceId,

        rabbitId:
          input.rabbitId,

                completedAt,
      },
    });

    return this.mapTask(updated);
  }

  // ============================================================
  // CORRECTIONS (modifier / supprimer)
  // ============================================================

  private optionalText(value: string | undefined) {
    return value === undefined ? undefined : value.trim() || null;
  }

  async updateExpense(input: UpdateExpenseInput, currentUser: CurrentUserType) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
    });
    if (!expense) {
      throw new NotFoundException('Dépense introuvable.');
    }
    if (input.amount != null && input.amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à zéro.');
    }
    let date: Date | undefined;
    if (input.date) {
      date = new Date(input.date);
      this.validateDate(date, 'de dépense');
    }
    const updated = await this.prisma.expense.update({
      where: { id: expense.id },
      data: {
        category: input.category ?? undefined,
        amount: input.amount ?? undefined,
        date,
        description: this.optionalText(input.description),
        reference: this.optionalText(input.reference),
        supplier: this.optionalText(input.supplier),
        paymentMethod: input.paymentMethod ?? undefined,
        observation: this.optionalText(input.observation),
      },
    });
    return this.mapExpense(updated);
  }

  async deleteExpense(id: string, currentUser: CurrentUserType) {
    const { count } = await this.prisma.expense.deleteMany({
      where: { id, farmId: currentUser.farmId },
    });
    if (!count) {
      throw new NotFoundException('Dépense introuvable.');
    }
    return true;
  }

  async updateInventoryItem(
    input: UpdateInventoryItemInput,
    currentUser: CurrentUserType,
  ) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
    });
    if (!item) {
      throw new NotFoundException('Article de stock introuvable.');
    }
    const name = input.name?.trim();
    if (input.name !== undefined && !name) {
      throw new BadRequestException('Le nom de l’article est obligatoire.');
    }
    if (input.unit !== undefined && !input.unit.trim()) {
      throw new BadRequestException('L’unité de l’article est obligatoire.');
    }
    if (input.minimumStock != null && input.minimumStock < 0) {
      throw new BadRequestException('Le stock minimum ne peut pas être négatif.');
    }
    if (input.unitPrice != null && input.unitPrice < 0) {
      throw new BadRequestException('Le prix unitaire ne peut pas être négatif.');
    }
    if (name && name !== item.name) {
      const duplicate = await this.prisma.inventoryItem.findUnique({
        where: { farmId_name: { farmId: currentUser.farmId, name } },
      });
      if (duplicate) {
        throw new ConflictException('Un autre article porte déjà ce nom.');
      }
    }
    const updated = await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        name,
        type: input.type ?? undefined,
        unit: input.unit?.trim(),
        minimumStock: input.minimumStock,
        unitPrice: input.unitPrice,
        description: this.optionalText(input.description),
      },
      include: { movements: { orderBy: { date: 'desc' } } },
    });
    await this.automation.onStockChanged(currentUser.farmId, item.id);
    return this.mapInventoryItem(updated);
  }

  async deleteInventoryItem(id: string, currentUser: CurrentUserType) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, farmId: currentUser.farmId },
    });
    if (!item) {
      throw new NotFoundException('Article de stock introuvable.');
    }
    // Les mouvements sont supprimés en cascade.
    await this.prisma.inventoryItem.delete({ where: { id: item.id } });
    return true;
  }

  /**
   * Supprime un mouvement de stock et annule son effet
   * sur le stock courant.
   */
  async deleteStockMovement(id: string, currentUser: CurrentUserType) {
    return this.prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.findFirst({
        where: { id, inventoryItem: { farmId: currentUser.farmId } },
        include: { inventoryItem: true },
      });
      if (!movement) {
        throw new NotFoundException('Mouvement de stock introuvable.');
      }
      const delta = this.signedQuantity(movement.type, movement.quantity);
      const nextStock = movement.inventoryItem.currentStock - delta;
      if (nextStock < -1e-9) {
        throw new BadRequestException(
          'Impossible : le stock deviendrait négatif. Supprime d’abord les sorties plus récentes.',
        );
      }
      await tx.stockMovement.delete({ where: { id: movement.id } });
      // Déduction de rations annulée : ces jours redeviennent « à déduire ».
      const rationStart = /^Rations du (\d{4}-\d{2}-\d{2})/.exec(movement.description ?? '')?.[1];
      await tx.inventoryItem.update({
        where: { id: movement.inventoryItemId },
        data: {
          currentStock: Math.max(0, nextStock),
          ...(rationStart ? { rationsAppliedUntil: new Date(`${rationStart}T00:00:00.000Z`) } : {}),
        },
      });
      await this.automation.onStockChanged(
        currentUser.farmId,
        movement.inventoryItemId,
        tx,
      );
      return true;
    });
  }

  async deleteTask(id: string, currentUser: CurrentUserType) {
    const { count } = await this.prisma.task.deleteMany({
      where: { id, farmId: currentUser.farmId },
    });
    if (!count) {
      throw new NotFoundException('Tâche introuvable.');
    }
    return true;
  }
}
