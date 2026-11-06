import { registerEnumType } from '@nestjs/graphql';
import { LitterStatus } from '../../generated/prisma/client';

registerEnumType(LitterStatus, { name: 'LitterStatus' });

export { LitterStatus };
