import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FarmModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}