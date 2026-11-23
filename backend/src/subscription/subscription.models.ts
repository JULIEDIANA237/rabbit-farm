import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { SubscriptionPaymentStatus, SubscriptionPlan } from '../generated/prisma/client.js';

registerEnumType(SubscriptionPlan, { name: 'SubscriptionPlan', description: 'MONTHLY (mensuel) ou YEARLY (annuel)' });
registerEnumType(SubscriptionPaymentStatus, { name: 'SubscriptionPaymentStatus' });

export enum AccessStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  EXEMPT = 'EXEMPT',
}
registerEnumType(AccessStatus, {
  name: 'AccessStatus',
  description: 'TRIAL (essai), ACTIVE (payé), EXPIRED (lecture seule), EXEMPT (propriétaire de l’app)',
});

@ObjectType()
export class PlatformSettingsModel {
  @Field(() => Int) trialDays: number;
  @Field(() => Int) monthlyPrice: number;
  @Field(() => Int) yearlyPrice: number;
  @Field(() => String, { nullable: true }) paymentInstructions?: string | null;
}

@ObjectType()
export class SubscriptionPaymentModel {
  @Field(() => ID) id: string;
  @Field(() => SubscriptionPlan) plan: SubscriptionPlan;
  @Field(() => Int) amount: number;
  @Field(() => SubscriptionPaymentStatus) status: SubscriptionPaymentStatus;
  @Field(() => String, { nullable: true }) reference?: string | null;
  @Field(() => Date, { nullable: true }) periodEnd?: Date | null;
  @Field() createdAt: Date;
  @Field(() => String, { nullable: true, description: 'Vue propriétaire' }) farmName?: string | null;
  @Field(() => String, { nullable: true, description: 'Vue propriétaire' }) farmId?: string | null;
}

@ObjectType()
export class SubscriptionStatusModel {
  @Field(() => AccessStatus) status: AccessStatus;
  @Field({ description: 'Vrai quand l’essai est fini et rien n’est payé : seule la lecture est permise.' })
  readOnly: boolean;
  @Field() trialEndsAt: Date;
  @Field(() => Date, { nullable: true }) paidUntil?: Date | null;
  @Field(() => Int, { description: 'Jours restants (essai ou période payée).' }) daysLeft: number;
  @Field(() => PlatformSettingsModel) settings: PlatformSettingsModel;
  @Field(() => SubscriptionPaymentModel, { nullable: true, description: 'Paiement déclaré en attente de confirmation.' })
  pendingPayment?: SubscriptionPaymentModel | null;
  @Field({ description: 'Vrai quand le paiement Mobile Money en ligne (NotchPay) est disponible.' })
  onlinePaymentEnabled: boolean;
}

@ObjectType()
export class SubscriptionCheckoutModel {
  @Field(() => ID) paymentId: string;
  @Field({ description: 'Page de paiement NotchPay où ouvrir l’éleveur' }) url: string;
}

@ObjectType()
export class FarmAccessModel {
  @Field(() => ID) farmId: string;
  @Field() farmName: string;
  @Field(() => String, { nullable: true }) ownerEmail?: string | null;
  @Field() createdAt: Date;
  @Field(() => AccessStatus) status: AccessStatus;
  @Field() trialEndsAt: Date;
  @Field(() => Date, { nullable: true }) paidUntil?: Date | null;
  @Field(() => Int) daysLeft: number;
  @Field({ description: 'Accès gratuit à vie accordé' }) freeAccess: boolean;
  @Field(() => [String], { description: 'E-mails des membres, pour retrouver un élevage' }) memberEmails: string[];
}

@ObjectType()
export class SubscriptionAdminModel {
  @Field(() => PlatformSettingsModel) settings: PlatformSettingsModel;
  @Field(() => [SubscriptionPaymentModel]) pendingPayments: SubscriptionPaymentModel[];
  @Field(() => [FarmAccessModel]) farms: FarmAccessModel[];
  @Field(() => Int, { description: 'Total confirmé sur 30 jours' }) revenue30d: number;
  @Field(() => Int) revenueTotal: number;
  @Field(() => Int) payingFarms: number;
  @Field(() => Int) trialFarms: number;
  @Field(() => Int) expiredFarms: number;
}
