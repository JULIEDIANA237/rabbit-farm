import { registerEnumType } from '@nestjs/graphql';

export enum RabbitSex {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

registerEnumType(RabbitSex, {
  name: 'RabbitSex',
});