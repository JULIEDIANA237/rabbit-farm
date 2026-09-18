import {
  Field,
  InputType,
} from '@nestjs/graphql';

import { RabbitIdentificationType } from '../graphql/rabbit-identification-type.enum';

@InputType()
export class AddRabbitIdentificationInput {
  @Field(() => RabbitIdentificationType)
  type: RabbitIdentificationType;

  @Field()
  value: string;
}