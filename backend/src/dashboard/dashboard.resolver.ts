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
@UseGuards(JwtAuthGuard)
async dashboard(
  @CurrentUser() currentUser: CurrentUserType,
) {
  console.log('>>> DASHBOARD RESOLVER');
  console.log('>>> USER:', currentUser);

  const result = await this.dashboardService.getDashboard(currentUser);

  console.log('>>> DASHBOARD TERMINÉ');

  return result;
}
}