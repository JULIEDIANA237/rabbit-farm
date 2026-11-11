import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { CronController } from './cron.controller.js';
import { NotificationsResolver } from './notifications.resolver.js';
import { NotificationsService } from './notifications.service.js';

@Module({
  imports: [AuthModule],
  controllers: [CronController],
  providers: [NotificationsService, NotificationsResolver],
})
export class NotificationsModule {}
