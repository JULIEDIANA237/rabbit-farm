import { registerEnumType } from '@nestjs/graphql';

import { CageStatus } from '../../generated/prisma/client.js';

registerEnumType(CageStatus, {
  name: 'CageStatus',
});

export { CageStatus };