import { registerEnumType } from '@nestjs/graphql';

import  { SectionType } from '../../generated/prisma/client.js';

registerEnumType(SectionType, {
  name: 'SectionType',
});

export { SectionType };