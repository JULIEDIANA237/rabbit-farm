import { registerEnumType } from '@nestjs/graphql';

import { TaskPriority } from '../../generated/prisma/client';

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
});

export { TaskPriority };
