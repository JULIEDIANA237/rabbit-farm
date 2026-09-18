import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RabbitCageMovementModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  rabbitId: string;

  @Field(() => ID)
  cageId: string;

  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  endedAt?: Date;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;
}