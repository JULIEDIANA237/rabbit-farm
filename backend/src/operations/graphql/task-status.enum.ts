import { registerEnumType } from '@nestjs/graphql';

import { TaskStatus } from '../../generated/prisma/client.js';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

export { TaskStatus };
