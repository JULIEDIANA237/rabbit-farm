import { registerEnumType } from '@nestjs/graphql';
import { PregnancyResult } from '../../generated/prisma/client';

registerEnumType(PregnancyResult, {
  name: 'PregnancyResult',
});

export { PregnancyResult };