import { registerEnumType } from '@nestjs/graphql';
import { MortalityScope } from '../../generated/prisma/client.js';

registerEnumType(MortalityScope, { name: 'MortalityScope' });

export { MortalityScope };
