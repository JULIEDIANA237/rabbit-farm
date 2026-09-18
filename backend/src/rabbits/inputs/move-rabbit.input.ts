import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class MoveRabbitInput {
  @Field(() => ID)
  rabbitId: string;

  @Field(() => ID)
  cageId: string;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  observation?: string;
}