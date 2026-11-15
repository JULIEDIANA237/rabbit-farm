import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { FarmRole } from '../generated/prisma/client.js';

import { CareService } from './care.service.js';
import { CareRecordModel, CreateCareRecordInput, UpdateCareRecordInput } from './care.graphql.js';

const WRITERS = [FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE];

@Resolver(() => CareRecordModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CareResolver {
  constructor(private readonly care: CareService) {}

  @Query(() => [CareRecordModel], { description: 'Soins saisis par l’éleveur' })
  careRecords(
    @Args('from', { type: () => Date, nullable: true }) from: Date | undefined,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.care.list(currentUser, from);
  }

  @Mutation(() => CareRecordModel)
  @Roles(...WRITERS)
  createCareRecord(@Args('input') input: CreateCareRecordInput, @CurrentUser() currentUser: CurrentUserType) {
    return this.care.create(input, currentUser);
  }

  @Mutation(() => CareRecordModel)
  @Roles(...WRITERS)
  updateCareRecord(@Args('input') input: UpdateCareRecordInput, @CurrentUser() currentUser: CurrentUserType) {
    return this.care.update(input, currentUser);
  }

  @Mutation(() => Boolean)
  @Roles(...WRITERS)
  deleteCareRecord(@Args('id', { type: () => ID }) id: string, @CurrentUser() currentUser: CurrentUserType) {
    return this.care.remove(id, currentUser);
  }
}
