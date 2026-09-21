import { registerEnumType } from '@nestjs/graphql';

import { SaleStatus } from '../../generated/prisma/client';

registerEnumType(SaleStatus, {
  name: 'SaleStatus',
});

export { SaleStatus };
