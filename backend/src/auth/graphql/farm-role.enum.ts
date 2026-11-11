import { registerEnumType } from '@nestjs/graphql';

import { FarmRole } from '../../generated/prisma/client.js';

registerEnumType(FarmRole, {
  name: 'FarmRole',
});

export { FarmRole };