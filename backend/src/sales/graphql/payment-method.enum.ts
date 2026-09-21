import { registerEnumType } from '@nestjs/graphql';

import { PaymentMethod } from '../../generated/prisma/client';

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

export { PaymentMethod };
