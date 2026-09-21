import { registerEnumType } from '@nestjs/graphql';

import { ExpenseCategory } from '../../generated/prisma/client';

registerEnumType(ExpenseCategory, {
  name: 'ExpenseCategory',
});

export { ExpenseCategory };
