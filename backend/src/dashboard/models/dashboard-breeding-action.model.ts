import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardBreedingActionModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  femaleId: string;

  @Field()
  femaleCode: string;

  @Field()
  breedingDate: Date;

  @Field({ nullable: true })
  palpationStartDate?: Date;

  @Field({ nullable: true })
  palpationEndDate?: Date;

  @Field({ nullable: true })
  nestDate?: Date;

  @Field({ nullable: true })
  expectedBirthStartDate?: Date;

  @Field({ nullable: true })
  expectedBirthEndDate?: Date;
}