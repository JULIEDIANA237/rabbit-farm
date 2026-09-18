import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { CageStatus } from '../graphql/cage-status.enum';

@ObjectType()
export class CageModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => CageStatus)
  status: CageStatus;

  @Field({ nullable: true })
  type?: string;

  @Field()
  sectionId: string;

  @Field(() => Int)
  rabbitCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}