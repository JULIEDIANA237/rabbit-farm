import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { FatteningLotStatus } from '../graphql/fattening-lot-status.enum';

@ObjectType()
export class FatteningLotModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  entryDate: Date;

  @Field({ nullable: true })
  exitDate?: Date;

  @Field(() => FatteningLotStatus)
  status: FatteningLotStatus;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => Int, { description: 'Lapins actuellement dans le lot' })
  activeMemberCount: number;

  @Field(() => ID, { nullable: true })
  currentCageId?: string | null;

  @Field(() => String, { nullable: true })
  currentCageCode?: string | null;

  @Field(() => Float, { nullable: true, description: 'Poids moyen de la dernière pesée (kg)' })
  latestAverageWeight?: number | null;

  @Field(() => Date, { nullable: true })
  latestWeighingDate?: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
