import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SalesService } from './sales.service.js';
import { UpdateCustomerInput } from './inputs/update-customer.input.js';
import { UpdateSaleInput } from './inputs/update-sale.input.js';
import { CancelSaleInput } from './inputs/cancel-sale.input.js';
import { CustomerModel } from './models/customer.model.js';
import { PaymentModel, SaleModel } from './models/sale.model.js';
import { CreateCustomerInput } from './inputs/create-customer.input.js';
import { CreateSaleInput } from './inputs/create-sale.input.js';
import { CreatePaymentInput } from './inputs/create-payment.input.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { FarmRole } from '../generated/prisma/client.js';

@Resolver(() => SaleModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesResolver {
  constructor(private readonly salesService: SalesService) {}

  @Query(() => [CustomerModel])
  customers(@CurrentUser() currentUser: CurrentUserType) {
    return this.salesService.customers(currentUser);
  }

  @Query(() => CustomerModel)
  customer(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.findCustomer(id, currentUser);
  }

  @Query(() => [SaleModel])
  sales(
    @Args('customerId', { type: () => ID, nullable: true })
    customerId: string | undefined,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.sales(currentUser, customerId);
  }

  @Query(() => SaleModel)
  sale(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.findSale(id, currentUser);
  }

  @Mutation(() => CustomerModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createCustomer(
    @Args('input') input: CreateCustomerInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.createCustomer(input, currentUser);
  }

  @Mutation(() => SaleModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createSale(
    @Args('input') input: CreateSaleInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.createSale(input, currentUser);
  }

  @Mutation(() => PaymentModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  addPayment(
    @Args('input') input: CreatePaymentInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.addPayment(input, currentUser);
  }

  @Mutation(() => SaleModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  cancelSale(
    @Args('input') input: CancelSaleInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.cancelSale(input, currentUser);
  }

  @Mutation(() => CustomerModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  updateCustomer(
    @Args('input') input: UpdateCustomerInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.updateCustomer(input, currentUser);
  }

  @Mutation(() => Boolean)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  deleteCustomer(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.deleteCustomer(id, currentUser);
  }

  @Mutation(() => SaleModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  updateSale(
    @Args('input') input: UpdateSaleInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.updateSale(input, currentUser);
  }

  @Mutation(() => Boolean)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  deleteSale(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.deleteSale(id, currentUser);
  }

  @Mutation(() => Boolean)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  deletePayment(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.salesService.deletePayment(id, currentUser);
  }
}
