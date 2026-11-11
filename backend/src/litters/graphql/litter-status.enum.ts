import { registerEnumType } from '@nestjs/graphql';
import { LitterStatus } from '../../generated/prisma/client.js';

registerEnumType(LitterStatus, { name: 'LitterStatus' });

export { LitterStatus };
