import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCrossBreedInput {
  @Field()
  name: string;

  @Field(() => ID)
  parentBreedAId: string;

  @Field(() => ID)
  parentBreedBId: string;

  @Field({ nullable: true })
  description?: string;
}