import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCrossBreedInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => ID, { nullable: true })
  parentBreedAId?: string;

  @Field(() => ID, { nullable: true })
  parentBreedBId?: string;

  @Field({ nullable: true })
  description?: string;
}