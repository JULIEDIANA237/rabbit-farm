import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  StockMovementType,
  TaskPriority,
  TaskSourceType,
  TaskStatus,
} from '../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import type { CurrentUserType } from '../auth/types/current-user.type';

import { CreateExpenseInput } from './inputs/create-expense.input';
import { CreateInventoryItemInput } from './inputs/create-inventory-item.input';
import { CreateStockMovementInput } from './inputs/create-stock-movement.input';
import { CreateTaskInput } from './inputs/create-task.input';
import { UpdateTaskInput } from './inputs/update-task.input';

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
  constructor(private readonly prisma: PrismaService) {}

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
    movements?: Array<{
      type: StockMovementType;
      quantity: number;
      unitCost: { toString(): string } | number | null;
    }>;
  }) {
    return {
      ...item,
      currentStock: item.currentStock,
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

    const item =
      await this.prisma.inventoryItem.create({
        data: {
          farmId: currentUser.farmId,

          name,
          type: input.type,
          unit,

          minimumStock: input.minimumStock,

          // Le stock initial est toujours 0.
          // Il sera modifié par un mouvement INITIAL.
          currentStock: 0,

          description:
            input.description?.trim() || null,
        },

        include: {
          movements: true,
        },
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
        },
      });

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

    return this.prisma.task.create({
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
  }

  async tasks(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.task.findMany({
      where: {
        farmId: currentUser.farmId,
      },

      orderBy: [
        {
          dueDate: 'asc',
        },
        {
          priority: 'desc',
        },
      ],
    });
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
      });

    if (!task) {
      throw new NotFoundException(
        'Tâche introuvable.',
      );
    }

    return task;
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

    return this.prisma.task.update({
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
  }
}