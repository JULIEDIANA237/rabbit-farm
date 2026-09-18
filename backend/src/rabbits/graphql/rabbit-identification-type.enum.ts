import { registerEnumType } from '@nestjs/graphql';

import { RabbitIdentificationType } from '../../generated/prisma/client';

registerEnumType(RabbitIdentificationType, {
  name: 'RabbitIdentificationType',
});

export { RabbitIdentificationType };