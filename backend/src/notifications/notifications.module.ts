import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { CronController } from './cron.controller';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [AuthModule],
  controllers: [CronController],
  providers: [NotificationsService, NotificationsResolver],
})
export class NotificationsModule {}
