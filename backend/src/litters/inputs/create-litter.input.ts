import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLitterInput {
  @Field(() => ID)
  birthId: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  observation?: string;
}