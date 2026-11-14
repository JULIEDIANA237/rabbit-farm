import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

import { FeedingCategory } from '../graphql/feeding-category.enum.js';

@ObjectType()
export class FeedingHeadcountsModel {
  @Field(() => Int, { description: 'Femelles gestantes confirmées' })
  PREGNANT: number;

  @Field(() => Int, { description: 'Femelles allaitantes (portée non sevrée)' })
  LACTATING: number;

  @Field(() => Int, { description: 'Lapins à l’engraissement (sevrés)' })
  FATTENING: number;

  @Field(() => Int, { description: 'Tous les autres lapins actifs (entretien)' })
  MAINTENANCE: number;

  @Field(() => Int, { description: 'Lapereaux sous la mère, nourris avec elle' })
  underMother: number;
}

@ObjectType()
export class FeedRationModel {
  @Field(() => FeedingCategory)
  category: FeedingCategory;

  @Field(() => Float, { description: 'Quantité par lapin et par jour (unité de l’article)' })
  dailyQuantity: number;
}

@ObjectType()
export class FeedingItemPlanModel {
  @Field(() => ID)
  inventoryItemId: string;

  @Field()
  name: string;

  @Field()
  unit: string;

  @Field(() => Float)
  currentStock: number;

  @Field(() => Float, { nullable: true })
  unitPrice?: number | null;

  @Field(() => [FeedRationModel])
  rations: FeedRationModel[];

  @Field(() => Float, { description: 'Besoin journalier de toute la ferme' })
  dailyNeed: number;

  @Field(() => Float, { nullable: true, description: 'Coût journalier (besoin × prix unitaire)' })
  dailyCost?: number | null;

  @Field(() => Date, { nullable: true, description: 'Rations déduites du stock jusqu’à cette date' })
  appliedUntil?: Date | null;

  @Field(() => Int, { description: 'Jours de rations pas encore déduits' })
  pendingDays: number;

  @Field(() => Float)
  pendingQuantity: number;

  @Field(() => Float, { description: 'Stock estimé après déduction des jours en attente' })
  estimatedStock: number;

  @Field(() => Float, { nullable: true })
  autonomyDays?: number | null;

  @Field(() => Date, { nullable: true, description: 'Date estimée de rupture' })
  depletionDate?: Date | null;
}

@ObjectType()
export class FeedingPlanModel {
  @Field(() => FeedingHeadcountsModel)
  headcounts: FeedingHeadcountsModel;

  @Field(() => [FeedingItemPlanModel])
  items: FeedingItemPlanModel[];
}

@InputType()
export class FeedRationInput {
  @Field(() => FeedingCategory)
  category: FeedingCategory;

  @Field(() => Float, { description: '0 pour retirer la ration' })
  dailyQuantity: number;
}

@InputType()
export class SetFeedRationsInput {
  @Field(() => ID)
  inventoryItemId: string;

  @Field(() => [FeedRationInput])
  rations: FeedRationInput[];

  @Field({
    nullable: true,
    description: 'Début du calcul des rations (par défaut : aujourd’hui, ou la dernière déduction).',
  })
  startDate?: Date;
}
