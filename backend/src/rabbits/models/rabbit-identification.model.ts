import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

import { RabbitIdentificationType } from '../graphql/rabbit-identification-type.enum';

@ObjectType()
export class RabbitIdentificationModel {
  @Field(() => ID)
  id: string;

  @Field(() => RabbitIdentificationType)
  type: RabbitIdentificationType;

  @Field()
  value: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}