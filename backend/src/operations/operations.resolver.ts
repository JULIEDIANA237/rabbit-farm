import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { OperationsService } from './operations.service.js';
import { TaskStatus } from './graphql/task-status.enum.js';
import { ExpenseModel } from './models/expense.model.js';
import { InventoryItemModel } from './models/inventory-item.model.js';
import { StockMovementModel } from './models/stock-movement.model.js';
import { TaskModel } from './models/task.model.js';
import { CreateExpenseInput } from './inputs/create-expense.input.js';
import { CreateInventoryItemInput } from './inputs/create-inventory-item.input.js';
import { CreateStockMovementInput } from './inputs/create-stock-movement.input.js';
import { CreateTaskInput } from './inputs/create-task.input.js';
import { UpdateTaskInput } from './inputs/update-task.input.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { FarmRole } from '../generated/prisma/client.js';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationsResolver {
  constructor(private readonly operationsService: OperationsService) {}

  @Query(() => [ExpenseModel])
  expenses(@CurrentUser() currentUser: CurrentUserType) {
    return this.operationsService.expenses(currentUser);
  }

  @Query(() => [InventoryItemModel])
  inventoryItems(@CurrentUser() currentUser: CurrentUserType) {
    return this.operationsService.inventoryItems(currentUser);
  }

  @Query(() => InventoryItemModel)
  inventoryItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.findInventoryItem(id, currentUser);
  }

  @Query(() => [TaskModel])
  tasks(
    @Args('status', { type: () => TaskStatus, nullable: true })
    status: TaskStatus | undefined,
    @Args('from', { type: () => Date, nullable: true }) from: Date | undefined,
    @Args('to', { type: () => Date, nullable: true }) to: Date | undefined,
    @Args('rabbitId', { type: () => ID, nullable: true })
    rabbitId: string | undefined,
    @Args('openOnly', { type: () => Boolean, nullable: true, defaultValue: false })
    openOnly: boolean,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.tasks(currentUser, {
      status,
      from,
      to,
      rabbitId,
      openOnly,
    });
  }

  @Query(() => TaskModel)
  task(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.findTask(id, currentUser);
  }

  @Mutation(() => ExpenseModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createExpense(
    @Args('input') input: CreateExpenseInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.createExpense(input, currentUser);
  }

  @Mutation(() => InventoryItemModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  createInventoryItem(
    @Args('input') input: CreateInventoryItemInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.createInventoryItem(input, currentUser);
  }

  @Mutation(() => StockMovementModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createStockMovement(
    @Args('input') input: CreateStockMovementInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.createStockMovement(input, currentUser);
  }

  @Mutation(() => TaskModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createTask(
    @Args('input') input: CreateTaskInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.createTask(input, currentUser);
  }

  @Mutation(() => TaskModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  updateTask(
    @Args('input') input: UpdateTaskInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.operationsService.updateTask(input, currentUser);
  }
}
