import { Field, ID, ObjectType } from '@nestjs/graphql';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
