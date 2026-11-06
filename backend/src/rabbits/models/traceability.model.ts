import { Field, ID, ObjectType } from '@nestjs/graphql';

import { RabbitModel } from './rabbit.model';
import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model';

@ObjectType()
export class TraceEventModel {
  @Field()
  date: Date;

  @Field({ description: 'BIRTH, CAGE, LOT, WEANING, ADOPTION, WEIGHING, HEALTH, BREEDING, SALE, EXIT' })
  type: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  detail?: string | null;

  @Field(() => ID, { nullable: true })
  referenceId?: string | null;
}

@ObjectType()
export class RabbitTraceabilityModel {
  @Field(() => RabbitModel)
  rabbit: RabbitModel;

  @Field(() => RabbitSummaryModel, { nullable: true })
  father?: RabbitSummaryModel | null;

  @Field(() => RabbitSummaryModel, { nullable: true })
  mother?: RabbitSummaryModel | null;

  @Field(() => String, { nullable: true })
  birthLitterCode?: string | null;

  @Field(() => [TraceEventModel])
  events: TraceEventModel[];
}
