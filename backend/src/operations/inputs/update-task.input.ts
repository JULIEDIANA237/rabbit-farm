import { Field, ID, InputType } from '@nestjs/graphql';

import { TaskPriority } from '../graphql/task-priority.enum';
import { TaskSourceType } from '../graphql/task-source-type.enum';
import { TaskStatus } from '../graphql/task-status.enum';

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field(() => ID, { nullable: true })
  assignedToId?: string;

  @Field(() => TaskSourceType, { nullable: true })
  sourceType?: TaskSourceType;

  @Field(() => ID, { nullable: true })
  sourceId?: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;
}