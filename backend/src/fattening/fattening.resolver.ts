import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { FatteningService } from './fattening.service';
import { FatteningLotModel } from './models/fattening-lot.model';
import { LotMembershipModel } from './models/lot-membership.model';
import { WeighingModel } from './models/weighing.model';
import { CreateFatteningLotInput } from './inputs/create-fattening-lot.input';
import { AddLotMembersInput } from './inputs/add-lot-members.input';
import { RemoveLotMembersInput } from './inputs/remove-lot-members.input';
import { CompleteFatteningLotInput } from './inputs/complete-fattening-lot.input';
import { CreateWeighingInput } from './inputs/create-weighing.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { FarmRole } from '../generated/prisma/client';

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
  weighings(@CurrentUser() currentUser: CurrentUserType) {
    return this.fatteningService.weighings(currentUser);
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
