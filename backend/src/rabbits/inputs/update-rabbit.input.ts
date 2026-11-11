import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import { RabbitStatus } from '../graphql/rabbit-status.enum.js';
import { RabbitPurpose } from '../graphql/rabbit-purpose.enum.js';
import { RabbitSex } from '../graphql/rabbit-sex.enum.js';

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

  @Field(() => ID, { nullable: true })
  fatherId?: string;

  @Field(() => ID, { nullable: true })
  motherId?: string;

  @Field({ nullable: true })
  birthDate?: Date;
}