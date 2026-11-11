import { Controller, Get, Headers, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';

import { NotificationsService } from './notifications.service';

/**
 * Appelé chaque matin par la tâche planifiée de Vercel (vercel.json → crons),
 * qui envoie « Authorization: Bearer <CRON_SECRET> ».
 */
@Controller('cron')
export class CronController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get('daily-reminders')
  dailyReminders(@Headers('authorization') authorization?: string) {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret) throw new ServiceUnavailableException('CRON_SECRET n’est pas configuré.');
    const expected = Buffer.from(`Bearer ${secret}`);
    const received = Buffer.from(authorization ?? '');
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      throw new UnauthorizedException();
    }
    return this.notifications.sendDailyReminders();
  }
}
