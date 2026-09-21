import { registerEnumType } from '@nestjs/graphql';

import { InventoryItemType } from '../../generated/prisma/client';

registerEnumType(InventoryItemType, {
  name: 'InventoryItemType',
});

export { InventoryItemType };
