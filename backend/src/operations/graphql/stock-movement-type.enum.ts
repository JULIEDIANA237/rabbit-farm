import { registerEnumType } from '@nestjs/graphql';

import { StockMovementType } from '../../generated/prisma/client.js';

registerEnumType(StockMovementType, {
  name: 'StockMovementType',
});

export { StockMovementType };
