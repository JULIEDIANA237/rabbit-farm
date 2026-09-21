import { Field, ID, InputType } from '@nestjs/graphql';

import { TaskPriority } from '../graphql/task-priority.enum';
import { TaskStatus } from '../graphql/task-status.enum';

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  id: string;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field(() => ID, { nullable: true })
  assignedToId?: string;
}
