import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CompleteWeaningInput {
  @Field(() => ID)
  id: string;

  @Field()
  actualDate: Date;

  @Field(() => [ID], { nullable: true })
  rabbitIds?: string[];

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  totalWeight?: number;

  @Field({ nullable: true })
  averageWeight?: number;
}
