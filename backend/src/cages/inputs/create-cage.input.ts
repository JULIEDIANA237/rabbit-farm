import {
  Field,
  ID,
  InputType,
  Int,
} from '@nestjs/graphql';

import { CageStatus } from '../graphql/cage-status.enum';

@InputType()
export class CreateCageInput {
  @Field()
  code: string;

  @Field(() => ID)
  sectionId: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => CageStatus, {
    nullable: true,
  })
  status?: CageStatus;

  @Field({ nullable: true })
  type?: string;
}