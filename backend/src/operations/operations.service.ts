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

  private toNumber(value: { toString(): string } | number | null | undefined) {
    if (value == null) {
      return null;
    }

    return Number(value);
  }

  private validateDate(date: Date, fieldName: string) {
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`La date ${fieldName} est invalide.`);
    }
  }

  private signedQuantity(type: StockMovementType, quantity: number) {
    if (INBOUND_MOVEMENTS.has(type)) {
      return Math.abs(quantity);
    }

    if (OUTBOUND_MOVEMENTS.has(type)) {
      return -Math.abs(quantity);
    }

    return quantity;
  }

  private currentStock(
    movements: Array<{ type: StockMovementType; quantity: number }>,
  ) {
    return movements.reduce(
      (sum, movement) =>
        sum + this.signedQuantity(movement.type, movement.quantity),
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
    movements: Array<{
      type: StockMovementType;
      quantity: number;
      unitCost: { toString(): string } | number | null;
    }>;
  }) {
    return {
      ...item,
      currentStock: this.currentStock(item.movements),
      movements: item.movements.map((movement) => this.mapMovement(movement)),
    };
  }

  async createExpense(
    input: CreateExpenseInput,
    currentUser: CurrentUserType,
  ) {
    if (input.amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à zéro.');
    }

    const date = new Date(input.date);
    this.validateDate(date, 'de dépense');

    const expense = await this.prisma.expense.create({
      data: {
        farmId: currentUser.farmId,
        category: input.category,
        amount: input.amount,
        date,
        description: input.description?.trim() || null,
        reference: input.reference?.trim() || null,
      },
    });

    return this.mapExpense(expense);
  }

  async expenses(currentUser: CurrentUserType) {
    const expenses = await this.prisma.expense.findMany({
      where: { farmId: currentUser.farmId },
      orderBy: { date: 'desc' },
    });

    return expenses.map((expense) => this.mapExpense(expense));
  }

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

    if (input.minimumStock != null && input.minimumStock < 0) {
      throw new BadRequestException('Le stock minimum ne peut pas être négatif.');
    }

    const existing = await this.prisma.inventoryItem.findUnique({
      where: {
        farmId_name: {
          farmId: currentUser.farmId,
          name,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Cet article existe déjà.');
    }

    const item = await this.prisma.inventoryItem.create({
      data: {
        farmId: currentUser.farmId,
        name,
        type: input.type,
        unit,
        minimumStock: input.minimumStock,
        description: input.description?.trim() || null,
      },
      include: { movements: true },
    });

    return this.mapInventoryItem(item);
  }

  async inventoryItems(currentUser: CurrentUserType) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { farmId: currentUser.farmId },
      include: { movements: { orderBy: { date: 'desc' } } },
      orderBy: { name: 'asc' },
    });

    return items.map((item) => this.mapInventoryItem(item));
  }

  async findInventoryItem(id: string, currentUser: CurrentUserType) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: { movements: { orderBy: { date: 'desc' } } },
    });

    if (!item) {
      throw new NotFoundException('Article de stock introuvable.');
    }

    return this.mapInventoryItem(item);
  }

  async createStockMovement(
    input: CreateStockMovementInput,
    currentUser: CurrentUserType,
  ) {
    const date = new Date(input.date);
    this.validateDate(date, 'de mouvement');

    if (input.quantity === 0) {
      throw new BadRequestException('La quantité ne peut pas être nulle.');
    }

    if (
      input.type !== StockMovementType.ADJUSTMENT &&
      input.quantity < 0
    ) {
      throw new BadRequestException(
        'La quantité doit être positive, sauf pour un ajustement.',
      );
    }

    if (input.unitCost != null && input.unitCost < 0) {
      throw new BadRequestException('Le coût unitaire est invalide.');
    }

    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: input.inventoryItemId, farmId: currentUser.farmId },
      include: { movements: true },
    });

    if (!item) {
      throw new NotFoundException('Article de stock introuvable.');
    }

    const nextStock =
      this.currentStock(item.movements) +
      this.signedQuantity(input.type, input.quantity);

    if (nextStock < 0) {
      throw new BadRequestException(
        'Le stock ne peut pas devenir négatif.',
      );
    }

    const movement = await this.prisma.stockMovement.create({
      data: {
        inventoryItemId: item.id,
        type: input.type,
        quantity: input.quantity,
        date,
        unitCost: input.unitCost,
        reference: input.reference?.trim() || null,
        description: input.description?.trim() || null,
      },
    });

    return this.mapMovement(movement);
  }

  async createTask(input: CreateTaskInput, currentUser: CurrentUserType) {
    const title = input.title.trim();

    if (!title) {
      throw new BadRequestException('Le titre de la tâche est obligatoire.');
    }

    const dueDate = new Date(input.dueDate);
    this.validateDate(dueDate, 'd’échéance');

    if (input.assignedToId) {
      const membership = await this.prisma.farmMembership.findFirst({
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

    return this.prisma.task.create({
      data: {
        farmId: currentUser.farmId,
        title,
        description: input.description?.trim() || null,
        dueDate,
        priority: input.priority ?? TaskPriority.MEDIUM,
        assignedToId: input.assignedToId,
        sourceType: input.sourceType?.trim() || null,
        sourceId: input.sourceId,
      },
    });
  }

  tasks(currentUser: CurrentUserType) {
    return this.prisma.task.findMany({
      where: { farmId: currentUser.farmId },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
    });
  }

  async findTask(id: string, currentUser: CurrentUserType) {
    const task = await this.prisma.task.findFirst({
      where: { id, farmId: currentUser.farmId },
    });

    if (!task) {
      throw new NotFoundException('Tâche introuvable.');
    }

    return task;
  }

  async updateTask(input: UpdateTaskInput, currentUser: CurrentUserType) {
    const task = await this.findTask(input.id, currentUser);

    if (input.assignedToId) {
      const membership = await this.prisma.farmMembership.findFirst({
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

    let completedAt = task.completedAt;

    if (input.status === TaskStatus.COMPLETED && !task.completedAt) {
      completedAt = new Date();
    }

    if (
      input.status &&
      input.status !== TaskStatus.COMPLETED &&
      task.status === TaskStatus.COMPLETED
    ) {
      completedAt = null;
    }

    return this.prisma.task.update({
      where: { id: task.id },
      data: {
        status: input.status,
        priority: input.priority,
        assignedToId: input.assignedToId,
        completedAt,
      },
    });
  }
}
