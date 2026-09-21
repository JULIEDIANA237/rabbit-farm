import { Field, ID, ObjectType } from '@nestjs/graphql';

import { TaskPriority } from '../graphql/task-priority.enum';
import { TaskStatus } from '../graphql/task-status.enum';

@ObjectType()
export class TaskModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  farmId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  dueDate: Date;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => ID, { nullable: true })
  assignedToId?: string;

  @Field({ nullable: true })
  sourceType?: string;

  @Field(() => ID, { nullable: true })
  sourceId?: string;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
