import { registerEnumType } from '@nestjs/graphql';

import { TaskStatus } from '../../generated/prisma/client';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

export { TaskStatus };
