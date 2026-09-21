import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AddLotMembersInput {
  @Field(() => ID)
  lotId: string;

  @Field(() => [ID])
  rabbitIds: string[];

  @Field({ nullable: true })
  reason?: string;
}
