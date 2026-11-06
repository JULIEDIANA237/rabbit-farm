import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CancelBreedingInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  observation?: string;
}
