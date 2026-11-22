import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { SalesModule } from '../sales/sales.module.js';
import { SetupModule } from '../setup/setup.module.js';

import { CompanionCronController } from './companion-cron.controller.js';
import { CompanionResolver } from './companion.resolver.js';
import { CompanionService } from './companion.service.js';

@Module({
  imports: [AuthModule, NotificationsModule, SalesModule, SetupModule],
  controllers: [CompanionCronController],
  providers: [CompanionService, CompanionResolver],
  exports: [CompanionService],
})
export class CompanionModule {}
