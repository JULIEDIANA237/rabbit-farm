import { registerEnumType } from '@nestjs/graphql';
import { MortalityScope } from '../../generated/prisma/client';

registerEnumType(MortalityScope, { name: 'MortalityScope' });

export { MortalityScope };
