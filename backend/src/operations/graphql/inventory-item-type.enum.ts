import { registerEnumType } from '@nestjs/graphql';

import { InventoryItemType } from '../../generated/prisma/client.js';

registerEnumType(InventoryItemType, {
  name: 'InventoryItemType',
});

export { InventoryItemType };
