import { registerEnumType } from '@nestjs/graphql';

import { SaleStatus } from '../../generated/prisma/client.js';

registerEnumType(SaleStatus, {
  name: 'SaleStatus',
});

export { SaleStatus };
