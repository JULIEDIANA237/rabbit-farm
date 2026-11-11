import { registerEnumType } from '@nestjs/graphql';
import { RabbitSex } from '../../generated/prisma/client.js';

registerEnumType(RabbitSex, {
  name: 'RabbitSex',
});

export { RabbitSex };
