import { registerEnumType } from '@nestjs/graphql';

import { CageStatus } from '../../generated/prisma/client';

registerEnumType(CageStatus, {
  name: 'CageStatus',
});

export { CageStatus };