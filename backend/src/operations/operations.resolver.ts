import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { OperationsService } from './operations.service';
import { ExpenseModel } from './models/expense.model';
import { InventoryItemModel } from './models/inventory-item.model';
import { StockMovementModel } from './models/stock-movement.model';
import { TaskModel } from './models/task.model';
import { CreateExpenseInput } from './inputs/create-expense.input';
import { CreateInventoryItemInput } from './inputs/create-inventory-item.input';
import { CreateStockMovementInput } from './inputs/create-stock-movement.input';
import { CreateTaskInput } from './inputs/create-task.input';
import { UpdateTaskInput } from './inputs/update-task.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { FarmRole } from '../generated/prisma/client';

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
  tasks(@CurrentUser() currentUser: CurrentUserType) {
    return this.operationsService.tasks(currentUser);
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
