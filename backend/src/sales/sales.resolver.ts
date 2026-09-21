import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SalesService } from './sales.service';
import { CustomerModel } from './models/customer.model';
import { PaymentModel, SaleModel } from './models/sale.model';
import { CreateCustomerInput } from './inputs/create-customer.input';
import { CreateSaleInput } from './inputs/create-sale.input';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { FarmRole } from '../generated/prisma/client';

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
  sales(@CurrentUser() currentUser: CurrentUserType) {
    return this.salesService.sales(currentUser);
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
}
