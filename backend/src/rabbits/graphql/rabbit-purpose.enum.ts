import { registerEnumType } from '@nestjs/graphql';
import { RabbitPurpose } from '../../generated/prisma/client.js';

registerEnumType(RabbitPurpose, {
  name: 'RabbitPurpose',
  description: 'Destination ou rôle du lapin dans l’élevage.',
});

export { RabbitPurpose };
