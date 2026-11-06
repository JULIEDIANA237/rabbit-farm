import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LotCageMovementModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  lotId: string;

  @Field(() => ID)
  cageId: string;

  @Field(() => String, { nullable: true })
  cageCode?: string | null;

  @Field()
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  endedAt?: Date | null;

  @Field(() => String, { nullable: true })
  reason?: string | null;

  @Field(() => String, { nullable: true })
  observation?: string | null;
}
