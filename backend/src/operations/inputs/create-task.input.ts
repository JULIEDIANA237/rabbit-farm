import { Field, ID, InputType } from '@nestjs/graphql';

import { TaskPriority } from '../graphql/task-priority.enum';
import { TaskSourceType } from '../graphql/task-source-type.enum';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  dueDate: Date;

  @Field(() => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field(() => ID, { nullable: true })
  assignedToId?: string;

  @Field(() => TaskSourceType, { nullable: true })
  sourceType?: TaskSourceType;

  @Field(() => ID, { nullable: true })
  sourceId?: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;
}