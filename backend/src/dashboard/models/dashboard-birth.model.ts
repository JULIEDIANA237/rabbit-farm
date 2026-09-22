import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class DashboardBirthModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  breedingId: string;

  @Field(() => ID)
  femaleId: string;

  @Field()
  femaleCode: string;

  @Field()
  birthDate: Date;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int)
  stillBorn: number;

  @Field(() => Int)
  totalBorn: number;
}