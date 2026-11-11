import { registerEnumType } from '@nestjs/graphql';
import { PregnancyResult } from '../../generated/prisma/client.js';

registerEnumType(PregnancyResult, {
  name: 'PregnancyResult',
});

export { PregnancyResult };