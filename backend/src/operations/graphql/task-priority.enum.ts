import { registerEnumType } from '@nestjs/graphql';

import { TaskPriority } from '../../generated/prisma/client.js';

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
});

export { TaskPriority };
