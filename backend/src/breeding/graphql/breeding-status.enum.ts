import { registerEnumType } from '@nestjs/graphql';
import { BreedingStatus } from '../../generated/prisma/client.js';

registerEnumType(BreedingStatus, {
  name: 'BreedingStatus',
});

export { BreedingStatus };