import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBreedingInput {
  @Field(() => ID)
  femaleId: string;

  @Field(() => ID)
  maleId: string;

  @Field()
  breedingDate: Date;

  @Field({ nullable: true })
  observation?: string;
}