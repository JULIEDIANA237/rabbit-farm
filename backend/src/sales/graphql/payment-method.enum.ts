import { registerEnumType } from '@nestjs/graphql';

import { PaymentMethod } from '../../generated/prisma/client.js';

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

export { PaymentMethod };
