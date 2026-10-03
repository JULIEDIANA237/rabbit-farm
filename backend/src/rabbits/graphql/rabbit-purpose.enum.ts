import { registerEnumType } from '@nestjs/graphql';

export enum RabbitPurpose {
  BREEDER = 'BREEDER',
  FATTENING = 'FATTENING',
  FUTURE_BREEDER = 'FUTURE_BREEDER',
  REFORM = 'REFORM',
}

registerEnumType(RabbitPurpose, {
  name: 'RabbitPurpose',
  description: 'Destination ou rôle du lapin dans l’élevage.',
});