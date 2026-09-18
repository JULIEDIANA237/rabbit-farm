import {
  Field,
  ID,
  InputType,
  Int,
} from '@nestjs/graphql';

import { CageStatus } from '../graphql/cage-status.enum';

@InputType()
export class UpdateCageInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  code?: string;

  @Field(() => ID, {
    nullable: true,
  })
  sectionId?: string;

  @Field(() => Int, {
    nullable: true,
  })
  capacity?: number;

  @Field(() => CageStatus, {
    nullable: true,
  })
  status?: CageStatus;

  @Field({ nullable: true })
  type?: string;
}