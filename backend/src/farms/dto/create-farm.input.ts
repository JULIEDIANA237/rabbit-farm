import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFarmInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;
}