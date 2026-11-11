import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model.js';
import { LitterStatus } from '../graphql/litter-status.enum.js';

@ObjectType()
export class LitterModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  birthId?: string | null;

  @Field(() => ID, { nullable: true })
  breedingId?: string | null;

  @Field()
  code: string;

  @Field(() => ID)
  motherId: string;

  @Field(() => ID, { nullable: true })
  fatherId?: string | null;

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

  @Field(() => Int, { description: 'Lapereaux actuellement élevés dans la portée' })
  currentCount: number;

  @Field(() => Int, { description: 'Lapereaux suivis individuellement' })
  kitCount: number;

  @Field(() => LitterStatus)
  status: LitterStatus;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
