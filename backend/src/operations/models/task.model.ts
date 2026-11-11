import { Field, ID, ObjectType } from '@nestjs/graphql';

import { TaskPriority } from '../graphql/task-priority.enum.js';
import { TaskSourceType } from '../graphql/task-source-type.enum.js';
import { TaskStatus } from '../graphql/task-status.enum.js';

@ObjectType()
export class TaskModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  farmId: string;

  @Field()
  title: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string | null;

  @Field(() => String, { nullable: true })
  rabbitCode?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Renseigné pour les tâches générées automatiquement',
  })
  automationKey?: string | null;

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

  @Field(() => TaskSourceType, { nullable: true })
  sourceType?: TaskSourceType;

  @Field(() => ID, { nullable: true })
  sourceId?: string;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}