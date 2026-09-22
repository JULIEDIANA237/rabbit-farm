import { Module } from '@nestjs/common';

import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';

import { AuthModule } from '../auth/auth.module';

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