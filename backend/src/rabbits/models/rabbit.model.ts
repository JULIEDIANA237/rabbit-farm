import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

import { RabbitSex } from '../graphql/rabbit-sex.enum';
import { RabbitStatus } from '../graphql/rabbit-status.enum';

import { RabbitIdentificationModel } from './rabbit-identification.model';

@ObjectType()
export class RabbitModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => RabbitSex)
  sex: RabbitSex;

  @Field(() => RabbitStatus)
  status: RabbitStatus;

  @Field({ nullable: true })
  breedId?: string;

  @Field({ nullable: true })
  crossBreedId?: string;

  @Field({ nullable: true })
  fatherId?: string;

  @Field({ nullable: true })
  motherId?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  geneticType?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  observations?: string;

  @Field(() => [RabbitIdentificationModel])
  identifications: RabbitIdentificationModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}