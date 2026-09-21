import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { WeaningService } from './weaning.service';
import { WeaningModel } from './models/weaning.model';
import { CreateWeaningInput } from './inputs/create-weaning.input';
import { CompleteWeaningInput } from './inputs/complete-weaning.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FarmRole } from '../generated/prisma/client';

@Resolver(() => WeaningModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class WeaningResolver {
  constructor(private readonly weaningService: WeaningService) {}

  @Mutation(() => WeaningModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createWeaning(
    @Args('input') input: CreateWeaningInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.weaningService.create(input, currentUser);
  }

  @Mutation(() => WeaningModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  completeWeaning(
    @Args('input') input: CompleteWeaningInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.weaningService.complete(input, currentUser);
  }

  @Query(() => [WeaningModel])
  weanings(@CurrentUser() currentUser: CurrentUserType) {
    return this.weaningService.findAll(currentUser);
  }

  @Query(() => WeaningModel, { nullable: true })
  weaning(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.weaningService.findOne(id, currentUser);
  }

  @Query(() => [WeaningModel])
  weaningsByLitter(
    @Args('litterId', { type: () => ID }) litterId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.weaningService.findByLitter(litterId, currentUser);
  }
}
