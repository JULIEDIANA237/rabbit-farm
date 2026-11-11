import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { DashboardService } from './dashboard.service.js';
import { DashboardModel } from './models/dashboard.model.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

@Resolver(() => DashboardModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardModel)
  async dashboard(@CurrentUser() currentUser: CurrentUserType) {
    return this.dashboardService.getDashboard(currentUser);
  }
}
