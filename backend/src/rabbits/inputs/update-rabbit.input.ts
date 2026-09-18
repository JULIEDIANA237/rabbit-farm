import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import { RabbitStatus } from '../graphql/rabbit-status.enum';

@InputType()
export class UpdateRabbitInput {
  @Field(() => ID)
  id: string;

  @Field({
    nullable: true,
  })
  code?: string;

  @Field(() => RabbitStatus, {
    nullable: true,
  })
  status?: RabbitStatus;

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