import { registerEnumType } from '@nestjs/graphql';

import { RabbitIdentificationType } from '../../generated/prisma/client.js';

registerEnumType(RabbitIdentificationType, {
  name: 'RabbitIdentificationType',
});

export { RabbitIdentificationType };