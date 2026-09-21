import { registerEnumType } from '@nestjs/graphql';

import { StockMovementType } from '../../generated/prisma/client';

registerEnumType(StockMovementType, {
  name: 'StockMovementType',
});

export { StockMovementType };
