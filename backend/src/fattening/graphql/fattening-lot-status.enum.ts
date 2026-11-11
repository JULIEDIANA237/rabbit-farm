import { registerEnumType } from '@nestjs/graphql';

import { FatteningLotStatus } from '../../generated/prisma/client.js';

registerEnumType(FatteningLotStatus, {
  name: 'FatteningLotStatus',
});

export { FatteningLotStatus };
