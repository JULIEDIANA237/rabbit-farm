import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model.js';

@ObjectType()
export class BirthModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  breedingId: string;

  @Field(() => ID)
  motherId: string;

  @Field(() => RabbitSummaryModel, { nullable: true })
  mother?: RabbitSummaryModel | null;

  @Field(() => RabbitSummaryModel, { nullable: true })
  father?: RabbitSummaryModel | null;

  @Field()
  birthDate: Date;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int)
  stillBorn: number;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => ID, { nullable: true })
  litterId?: string | null;

  @Field(() => String, { nullable: true })
  litterCode?: string | null;

  @Field()
  createdAt: Date;
}
