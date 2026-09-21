import { registerEnumType } from '@nestjs/graphql';

import { FatteningLotStatus } from '../../generated/prisma/client';

registerEnumType(FatteningLotStatus, {
  name: 'FatteningLotStatus',
});

export { FatteningLotStatus };
