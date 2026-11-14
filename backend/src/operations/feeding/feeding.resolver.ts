import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../../auth/types/current-user.type.js';
import { FarmRole } from '../../generated/prisma/client.js';
import { StockMovementModel } from '../models/stock-movement.model.js';
import { FeedingService } from './feeding.service.js';
import { FeedingItemPlanModel, FeedingPlanModel, SetFeedRationsInput } from './feeding.models.js';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedingResolver {
  constructor(private readonly feeding: FeedingService) {}

  @Query(() => FeedingPlanModel, {
    description: 'Effectifs par catégorie, besoins journaliers et autonomie de chaque aliment.',
  })
  feedingPlan(@CurrentUser() currentUser: CurrentUserType) {
    return this.feeding.plan(currentUser);
  }

  @Mutation(() => FeedingItemPlanModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  setFeedRations(
    @Args('input') input: SetFeedRationsInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.feeding.setRations(input, currentUser);
  }

  @Mutation(() => StockMovementModel, {
    nullable: true,
    description: 'Déduit du stock les rations des jours écoulés depuis la dernière déduction.',
  })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  applyFeedRations(
    @Args('inventoryItemId', { type: () => ID }) inventoryItemId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.feeding.applyRations(inventoryItemId, currentUser);
  }
}
