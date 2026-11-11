import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { PushConfigModel, PushSubscriptionInput } from './notifications.inputs';
import { NotificationsService } from './notifications.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class NotificationsResolver {
  constructor(private readonly notifications: NotificationsService) {}

  @Query(() => PushConfigModel, { description: 'Configuration des notifications du navigateur.' })
  pushConfig() {
    return this.notifications.config();
  }

  @Mutation(() => Boolean, { description: 'Abonne cet appareil aux rappels du jour.' })
  subscribePush(@CurrentUser() user: CurrentUserType, @Args('input') input: PushSubscriptionInput) {
    return this.notifications.subscribe(user, input);
  }

  @Mutation(() => Boolean, { description: 'Désabonne cet appareil.' })
  unsubscribePush(@CurrentUser() user: CurrentUserType, @Args('endpoint') endpoint: string) {
    return this.notifications.unsubscribe(user, endpoint);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Mutation(() => Int, { description: 'Envoie une notification d’essai ; renvoie le nombre d’appareils atteints.' })
  sendTestPush(@CurrentUser() user: CurrentUserType) {
    return this.notifications.sendTest(user);
  }
}
