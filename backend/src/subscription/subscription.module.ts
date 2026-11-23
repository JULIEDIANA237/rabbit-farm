import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module.js';

import { NotchPayClient } from './notchpay.client.js';
import { NotchPayWebhookController } from './notchpay.controller.js';
import { ReadOnlyInterceptor } from './read-only.interceptor.js';
import { SubscriptionResolver } from './subscription.resolver.js';
import { SubscriptionService } from './subscription.service.js';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [NotchPayWebhookController],
  providers: [NotchPayClient, SubscriptionService, SubscriptionResolver, { provide: APP_INTERCEPTOR, useClass: ReadOnlyInterceptor }],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
