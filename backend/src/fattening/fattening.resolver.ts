import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { FatteningService } from './fattening.service.js';
import { FatteningLotModel } from './models/fattening-lot.model.js';
import { LotMembershipModel } from './models/lot-membership.model.js';
import { WeighingModel } from './models/weighing.model.js';
import { CreateFatteningLotInput } from './inputs/create-fattening-lot.input.js';
import { AddLotMembersInput } from './inputs/add-lot-members.input.js';
import { RemoveLotMembersInput } from './inputs/remove-lot-members.input.js';
import { CompleteFatteningLotInput } from './inputs/complete-fattening-lot.input.js';
import { CreateWeighingInput } from './inputs/create-weighing.input.js';
import { MoveFatteningLotInput } from './inputs/move-fattening-lot.input.js';
import { LotCageMovementModel } from './models/lot-cage-movement.model.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { FarmRole } from '../generated/prisma/client.js';

@Resolver(() => FatteningLotModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class FatteningResolver {
  constructor(private readonly fatteningService: FatteningService) {}

  @Query(() => [FatteningLotModel])
  fatteningLots(@CurrentUser() currentUser: CurrentUserType) {
    return this.fatteningService.findLots(currentUser);
  }

  @Query(() => FatteningLotModel)
  fatteningLot(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.findLot(id, currentUser);
  }

  @Query(() => [LotMembershipModel])
  lotMemberships(
    @Args('lotId', { type: () => ID }) lotId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.memberships(lotId, currentUser);
  }

  @Query(() => [WeighingModel])
  weighings(
    @Args('lotId', { type: () => ID, nullable: true }) lotId: string | undefined,
    @Args('rabbitId', { type: () => ID, nullable: true }) rabbitId: string | undefined,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.weighings(currentUser, { lotId, rabbitId });
  }

  @Query(() => [LotCageMovementModel])
  lotCageMovements(
    @Args('lotId', { type: () => ID }) lotId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.lotCageMovements(lotId, currentUser);
  }

  @Mutation(() => LotCageMovementModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  moveFatteningLot(
    @Args('input') input: MoveFatteningLotInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.moveLot(input, currentUser);
  }

  @Mutation(() => FatteningLotModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createFatteningLot(
    @Args('input') input: CreateFatteningLotInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.createLot(input, currentUser);
  }

  @Mutation(() => [LotMembershipModel])
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  addLotMembers(
    @Args('input') input: AddLotMembersInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.addMembers(input, currentUser);
  }

  @Mutation(() => [LotMembershipModel])
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  removeLotMembers(
    @Args('input') input: RemoveLotMembersInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.removeMembers(input, currentUser);
  }

  @Mutation(() => FatteningLotModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  completeFatteningLot(
    @Args('input') input: CompleteFatteningLotInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.completeLot(input, currentUser);
  }

  @Mutation(() => WeighingModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  createWeighing(
    @Args('input') input: CreateWeighingInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.fatteningService.createWeighing(input, currentUser);
  }
}
