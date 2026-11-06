import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import { FarmStatisticsModel } from './models/statistics.models';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { FarmRole } from '../generated/prisma/client';

@Resolver(() => FarmStatisticsModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsResolver {
  constructor(private readonly statistics: StatisticsService) {}

  @Query(() => FarmStatisticsModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.VETERINARIAN)
  farmStatistics(
    @CurrentUser() currentUser: CurrentUserType,
    @Args('from', { type: () => Date, nullable: true }) from?: Date,
    @Args('to', { type: () => Date, nullable: true }) to?: Date,
  ) {
    return this.statistics.farmStatistics(currentUser, from, to);
  }
}
