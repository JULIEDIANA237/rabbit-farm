import { UseGuards } from '@nestjs/common';
import { Args, Field, ID, InputType, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { SubscriptionPlan } from '../generated/prisma/client.js';

import {
  PlatformSettingsModel,
  SubscriptionAdminModel,
  SubscriptionCheckoutModel,
  SubscriptionPaymentModel,
  SubscriptionStatusModel,
} from './subscription.models.js';
import { SubscriptionService } from './subscription.service.js';

@InputType()
export class PlatformSettingsInput {
  @Field(() => Int, { nullable: true }) trialDays?: number;
  @Field(() => Int, { nullable: true }) monthlyPrice?: number;
  @Field(() => Int, { nullable: true }) yearlyPrice?: number;
  @Field(() => String, { nullable: true }) paymentInstructions?: string | null;
}

@Resolver()
@UseGuards(JwtAuthGuard)
export class SubscriptionResolver {
  constructor(private readonly subscriptions: SubscriptionService) {}

  @Query(() => SubscriptionStatusModel, { description: 'Essai, abonnement et prix pour l’élevage connecté' })
  subscriptionStatus(@CurrentUser() user: CurrentUserType) {
    return this.subscriptions.status(user);
  }

  @Mutation(() => SubscriptionPaymentModel, { description: 'Déclarer un paiement Mobile Money, confirmé ensuite par la propriétaire' })
  declareSubscriptionPayment(
    @CurrentUser() user: CurrentUserType,
    @Args('plan', { type: () => SubscriptionPlan }) plan: SubscriptionPlan,
    @Args('reference', { type: () => String, nullable: true }) reference?: string,
  ) {
    return this.subscriptions.declarePayment(user, plan, reference);
  }

  @Mutation(() => SubscriptionCheckoutModel, { description: 'Ouvrir une page de paiement Mobile Money (NotchPay)' })
  startSubscriptionCheckout(
    @CurrentUser() user: CurrentUserType,
    @Args('plan', { type: () => SubscriptionPlan }) plan: SubscriptionPlan,
  ) {
    return this.subscriptions.startOnlinePayment(user, plan);
  }

  @Mutation(() => SubscriptionPaymentModel, { description: 'Vérifier un paiement en ligne au retour de NotchPay' })
  checkSubscriptionPayment(@CurrentUser() user: CurrentUserType, @Args('reference') reference: string) {
    return this.subscriptions.checkOnlinePayment(user, reference);
  }

  @Query(() => SubscriptionAdminModel, { description: 'Abonnements de tous les élevages (propriétaire)' })
  subscriptionAdmin(@CurrentUser() user: CurrentUserType) {
    return this.subscriptions.admin(user);
  }

  @Mutation(() => PlatformSettingsModel)
  updatePlatformSettings(@CurrentUser() user: CurrentUserType, @Args('input') input: PlatformSettingsInput) {
    return this.subscriptions.updateSettings(user, input);
  }

  @Mutation(() => SubscriptionPaymentModel)
  confirmSubscriptionPayment(@CurrentUser() user: CurrentUserType, @Args('id', { type: () => ID }) id: string) {
    return this.subscriptions.confirmPayment(user, id);
  }

  @Mutation(() => SubscriptionPaymentModel)
  rejectSubscriptionPayment(@CurrentUser() user: CurrentUserType, @Args('id', { type: () => ID }) id: string) {
    return this.subscriptions.rejectPayment(user, id);
  }

  @Mutation(() => Boolean, { description: 'Enregistrer à la main un abonnement payé hors de l’app' })
  activateSubscription(
    @CurrentUser() user: CurrentUserType,
    @Args('farmId', { type: () => ID }) farmId: string,
    @Args('plan', { type: () => SubscriptionPlan }) plan: SubscriptionPlan,
  ) {
    return this.subscriptions.activate(user, farmId, plan);
  }

  @Mutation(() => Boolean, { description: 'Accorder ou retirer l’accès gratuit à vie' })
  setFarmFreeAccess(
    @CurrentUser() user: CurrentUserType,
    @Args('farmId', { type: () => ID }) farmId: string,
    @Args('free') free: boolean,
  ) {
    return this.subscriptions.setFreeAccess(user, farmId, free);
  }

  @Mutation(() => Boolean, { description: 'Offrir des jours d’essai en plus' })
  extendTrial(
    @CurrentUser() user: CurrentUserType,
    @Args('farmId', { type: () => ID }) farmId: string,
    @Args('days', { type: () => Int }) days: number,
  ) {
    return this.subscriptions.extendTrial(user, farmId, days);
  }
}
