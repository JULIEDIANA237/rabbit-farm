import {
  Field,
  ID,
  InputType,
  Int,
} from '@nestjs/graphql';

import { RabbitSex } from '../../rabbits/graphql/rabbit-sex.enum';

@InputType()
export class CreateLitterRabbitsInput {
  @Field(() => ID)
  litterId: string;

  @Field(() => Int)
  numberOfRabbits: number;

  @Field(() => [RabbitSex], { nullable: true })
  sexes?: RabbitSex[];
}