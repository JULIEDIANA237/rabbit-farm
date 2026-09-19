import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBirthInput {
  @Field(() => ID)
  breedingId: string;

  @Field()
  birthDate: Date;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int)
  stillBorn: number;

  @Field({ nullable: true })
  observation?: string;
}