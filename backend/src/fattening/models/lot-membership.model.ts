import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LotMembershipModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  lotId: string;

  @Field(() => ID)
  rabbitId: string;

  @Field()
  joinedAt: Date;

  @Field({ nullable: true })
  leftAt?: Date;

  @Field({ nullable: true })
  reason?: string;

  @Field()
  createdAt: Date;
}
