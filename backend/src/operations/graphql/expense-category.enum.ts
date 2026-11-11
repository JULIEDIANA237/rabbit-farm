import { registerEnumType } from '@nestjs/graphql';

import { ExpenseCategory } from '../../generated/prisma/client.js';

registerEnumType(ExpenseCategory, {
  name: 'ExpenseCategory',
});

export { ExpenseCategory };
