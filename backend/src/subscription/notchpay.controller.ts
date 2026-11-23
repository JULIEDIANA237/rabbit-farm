import { Body, Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { SubscriptionService } from './subscription.service.js';

/** Webhook NotchPay (payment.complete, payment.failed, payment.canceled). Pas d'authentification : la signature fait foi. */
@Controller('payments/notchpay')
export class NotchPayWebhookController {
  constructor(private readonly subscriptions: SubscriptionService) {}

  @Post('webhook')
  @HttpCode(200)
  webhook(@Req() req: RawBodyRequest<Request>, @Headers('x-notch-signature') signature: string | undefined, @Body() body: unknown) {
    return this.subscriptions.handleWebhook(req.rawBody, signature, body);
  }
}
