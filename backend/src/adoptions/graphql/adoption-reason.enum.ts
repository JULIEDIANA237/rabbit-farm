import { registerEnumType } from '@nestjs/graphql';

import { AdoptionReason } from '../../generated/prisma/client';

registerEnumType(AdoptionReason, {
  name: 'AdoptionReason',
});

export { AdoptionReason };
