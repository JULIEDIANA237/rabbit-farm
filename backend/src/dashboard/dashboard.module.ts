import { Module } from '@nestjs/common';

import { DashboardResolver } from './dashboard.resolver.js';
import { DashboardService } from './dashboard.service.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
  ],

  providers: [
    DashboardService,
    DashboardResolver,
  ],
})
export class DashboardModule {}