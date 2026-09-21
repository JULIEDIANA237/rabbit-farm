import { Field, ID, InputType } from '@nestjs/graphql';

import { TaskPriority } from '../graphql/task-priority.enum';

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

  @Field({ nullable: true })
  sourceType?: string;

  @Field(() => ID, { nullable: true })
  sourceId?: string;
}
