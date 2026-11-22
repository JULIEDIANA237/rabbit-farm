import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Throttle } from '../common/throttle/throttle.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { SubscriptionService } from '../subscription/subscription.service.js';

import { ContactMessageInput, ContactMessageModel, PublicPricingModel } from './contact.models.js';
import { ContactService } from './contact.service.js';

@Resolver()
export class ContactResolver {
  constructor(
    private readonly contact: ContactService,
    private readonly subscriptions: SubscriptionService,
  ) {}

  @Query(() => PublicPricingModel, { description: 'Essai et prix, pour la page d’accueil (sans compte).' })
  async publicPricing() {
    const { trialDays, monthlyPrice, yearlyPrice } = await this.subscriptions.settings();
    return { trialDays, monthlyPrice, yearlyPrice };
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Mutation(() => Boolean, { description: 'Zone contact de la page d’accueil (sans compte).' })
  sendContactMessage(@Args('input') input: ContactMessageInput) {
    return this.contact.send(input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ContactMessageModel], { description: 'Messages reçus (propriétaire de l’app).' })
  contactMessages(@CurrentUser() user: CurrentUserType) {
    return this.contact.list(user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ContactMessageModel)
  setContactMessageHandled(
    @CurrentUser() user: CurrentUserType,
    @Args('id', { type: () => ID }) id: string,
    @Args('handled') handled: boolean,
  ) {
    return this.contact.setHandled(user, id, handled);
  }
}
