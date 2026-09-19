import { registerEnumType } from '@nestjs/graphql';
import { BreedingStatus } from '../../generated/prisma/client';

registerEnumType(BreedingStatus, {
  name: 'BreedingStatus',
});

export { BreedingStatus };