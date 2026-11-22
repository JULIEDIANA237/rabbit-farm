import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model.js';

/** Saillie supplémentaire ajoutée à un accouplement (même jour). */
@ObjectType()
export class BreedingMatingModel {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field(() => RabbitSummaryModel, { nullable: true })
  male?: RabbitSummaryModel | null;
}

/** Contexte affiché dans le formulaire de saillie. */
@ObjectType()
export class MatingContextModel {
  @Field(() => [String], { description: 'Femelles déjà couvertes par ce mâle sur 24 h' })
  maleFemalesLast24h: string[];

  @Field()
  maleLimitReached: boolean;

  @Field(() => ID, { nullable: true, description: 'Accouplement du jour auquel la saillie s’ajoutera' })
  sameDayBreedingId?: string | null;

  @Field(() => Int)
  sameDayMatingCount: number;

  @Field()
  femaleHasOtherActiveBreeding: boolean;
}
