import { registerEnumType } from '@nestjs/graphql';

import { RabbitSex } from '../../generated/prisma/client';

registerEnumType(RabbitSex, {
  name: 'RabbitSex',
});

export { RabbitSex };