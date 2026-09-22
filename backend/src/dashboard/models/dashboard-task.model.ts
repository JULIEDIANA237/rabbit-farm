import { Field, ID, ObjectType } from '@nestjs/graphql';

import { TaskPriority } from '../../operations/graphql/task-priority.enum';
import { TaskStatus } from '../../operations/graphql/task-status.enum';

@ObjectType()
export class DashboardTaskModel {
  @Field(() => ID)
  id: string;

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

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

  @Field({ nullable: true })
  sourceType?: string;

  @Field(() => ID, { nullable: true })
  sourceId?: string;

  @Field({ nullable: true })
  completedAt?: Date;
}