import { registerEnumType } from '@nestjs/graphql';

import  { SectionType } from '../../generated/prisma/client';

registerEnumType(SectionType, {
  name: 'SectionType',
});

export { SectionType };