import { Injectable, Logger } from '@nestjs/common';

import { BreedingStatus, TaskStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { readPushConfig, sendPush, type PushPayload, type PushResult } from './push-sender';
import { reminderMessage } from './reminder-message';
import type { PushSubscriptionInput } from './notifications.inputs';

const DAY = 86_400_000;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('Notifications');

  constructor(private readonly prisma: PrismaService) {}

  config() {
    return readPushConfig();
  }

  async subscribe(user: CurrentUserType, input: PushSubscriptionInput) {
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: input.endpoint },
      create: { endpoint: input.endpoint, p256dh: input.p256dh, auth: input.auth, userId: user.userId, farmId: user.farmId },
      update: { p256dh: input.p256dh, auth: input.auth, userId: user.userId, farmId: user.farmId },
    });
    return true;
  }

  async unsubscribe(user: CurrentUserType, endpoint: string) {
    await this.prisma.pushSubscription.deleteMany({ where: { endpoint, userId: user.userId } });
    return true;
  }

  /** Notification d'essai sur les appareils de l'utilisateur. */
  async sendTest(user: CurrentUserType) {
    const subscriptions = await this.prisma.pushSubscription.findMany({ where: { userId: user.userId } });
    const results = await this.deliver(subscriptions, {
      title: 'RabbitFarm',
      body: 'Les rappels du jour sont activés sur cet appareil.',
      url: '/dashboard',
    });
    return results.filter((result) => result === 'sent').length;
  }

  /** Rappel du matin pour chaque ferme qui a au moins un appareil abonné. */
  async sendDailyReminders(now = new Date()) {
    if (!this.config().enabled) return { farms: 0, sent: 0 };

    const subscriptions = await this.prisma.pushSubscription.findMany();
    const byFarm = new Map<string, typeof subscriptions>();
    for (const subscription of subscriptions) {
      byFarm.set(subscription.farmId, [...(byFarm.get(subscription.farmId) ?? []), subscription]);
    }

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + DAY);
    const open = { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] };

    let sent = 0;
    for (const [farmId, farmSubscriptions] of byFarm) {
      const [dueToday, overdue, birthsSoon] = await Promise.all([
        this.prisma.task.count({ where: { farmId, status: open, dueDate: { gte: start, lt: end } } }),
        this.prisma.task.count({ where: { farmId, status: open, dueDate: { lt: start } } }),
        this.prisma.breeding.count({
          where: {
            farmId,
            status: { in: [BreedingStatus.PREGNANT, BreedingStatus.AWAITING_PALPATION, BreedingStatus.INCONCLUSIVE] },
            expectedBirthStartDate: { gte: start, lt: new Date(start.getTime() + 2 * DAY) },
          },
        }),
      ]);
      const message = reminderMessage({ dueToday, overdue, birthsSoon });
      if (!message) continue;
      const results = await this.deliver(farmSubscriptions, { ...message, url: '/tasks' });
      sent += results.filter((result) => result === 'sent').length;
    }

    this.logger.log(`Rappels du jour : ${sent} notification(s) envoyée(s) pour ${byFarm.size} ferme(s).`);
    return { farms: byFarm.size, sent };
  }

  private async deliver(subscriptions: Array<{ id: string; endpoint: string; p256dh: string; auth: string }>, payload: PushPayload) {
    if (!this.config().enabled) return [] as PushResult[];
    const results = await Promise.all(subscriptions.map((subscription) => sendPush(subscription, payload)));
    const gone = subscriptions.filter((_, index) => results[index] === 'gone').map((subscription) => subscription.id);
    if (gone.length) await this.prisma.pushSubscription.deleteMany({ where: { id: { in: gone } } });
    return results;
  }
}
