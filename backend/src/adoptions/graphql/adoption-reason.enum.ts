import { registerEnumType } from '@nestjs/graphql';

import { AdoptionReason } from '../../generated/prisma/client.js';

registerEnumType(AdoptionReason, {
  name: 'AdoptionReason',
});

export { AdoptionReason };
