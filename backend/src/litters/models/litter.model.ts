import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LitterModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  birthId: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}