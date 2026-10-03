import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import { RabbitStatus } from '../graphql/rabbit-status.enum';
import { RabbitPurpose } from '../graphql/rabbit-purpose.enum';
import { RabbitSex } from '../graphql/rabbit-sex.enum';

@InputType()
export class UpdateRabbitInput {
  @Field(() => ID)
  id: string;

  @Field({
    nullable: true,
  })
  code?: string;

  @Field(() => RabbitSex, {
    nullable: true,
  })
  sex?: RabbitSex;

  @Field(() => RabbitStatus, {
    nullable: true,
  })
  status?: RabbitStatus;

  @Field(() => RabbitPurpose, {
    nullable: true,
  })
  purpose?: RabbitPurpose;

  @Field(() => ID, {
    nullable: true,
  })
  breedId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  crossBreedId?: string;

  @Field({
    nullable: true,
  })
  color?: string;

  @Field({
    nullable: true,
  })
  weight?: number;

  @Field({
    nullable: true,
  })
  observations?: string;
}