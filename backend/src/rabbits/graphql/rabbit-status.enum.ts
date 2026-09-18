import { registerEnumType } from '@nestjs/graphql';

import { RabbitStatus } from '../../generated/prisma/client';

registerEnumType(RabbitStatus, {
  name: 'RabbitStatus',
});

export { RabbitStatus };