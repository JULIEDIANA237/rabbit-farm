import { registerEnumType } from '@nestjs/graphql';

import { FarmRole } from '../../generated/prisma/client';

registerEnumType(FarmRole, {
  name: 'FarmRole',
});

export { FarmRole };