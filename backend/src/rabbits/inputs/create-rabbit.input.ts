import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import { RabbitSex } from '../graphql/rabbit-sex.enum';

@InputType()
export class CreateRabbitInput {
  @Field()
  code: string;

  @Field(() => RabbitSex)
  sex: RabbitSex;

  @Field(() => ID, {
    nullable: true,
  })
  breedId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  crossBreedId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  fatherId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  motherId?: string;

  @Field({
    nullable: true,
  })
  birthDate?: Date;

  @Field({
    nullable: true,
  })
  geneticType?: string;

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