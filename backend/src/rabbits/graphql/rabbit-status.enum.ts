import { registerEnumType } from '@nestjs/graphql';

import { RabbitStatus } from '../../generated/prisma/client.js';

registerEnumType(RabbitStatus, {
  name: 'RabbitStatus',
});

export { RabbitStatus };