import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  farmName: string;

  @Field({ nullable: true })
  farmDescription?: string;

  @Field({ nullable: true })
  farmLocation?: string;
}