import { Field, ID, InputType, Int } from '@nestjs/graphql';

import { RabbitSex } from '../graphql/rabbit-sex.enum.js';
import { RabbitStatus } from '../graphql/rabbit-status.enum.js';
import { RabbitPurpose } from '../graphql/rabbit-purpose.enum.js';

@InputType()
export class RabbitsPaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize?: number;

  @Field({ nullable: true })
  search?: string;

  @Field(() => RabbitSex, { nullable: true })
  sex?: RabbitSex;

  @Field(() => RabbitStatus, { nullable: true })
  status?: RabbitStatus;

  @Field(() => RabbitPurpose, { nullable: true })
  purpose?: RabbitPurpose;

  @Field(() => ID, { nullable: true })
  litterId?: string;

  @Field(() => ID, { nullable: true })
  cageId?: string;
}
