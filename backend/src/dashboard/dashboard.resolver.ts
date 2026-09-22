import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { DashboardModel } from './models/dashboard.model';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import type { CurrentUserType } from '../auth/types/current-user.type';

@Resolver(() => DashboardModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardResolver {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Query(() => DashboardModel)
  dashboard(
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.dashboardService.getDashboard(currentUser);
  }
}