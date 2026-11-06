import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CancelSaleInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  reason?: string;
}
