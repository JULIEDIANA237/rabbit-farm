import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BreedingStatus } from '../graphql/breeding-status.enum';

@ObjectType()
export class BreedingModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  femaleId: string;

  @Field(() => ID)
  maleId: string;

  @Field()
  breedingDate: Date;

  @Field()
  palpationStartDate: Date;

  @Field()
  palpationEndDate: Date;

  @Field()
  nestDate: Date;

  @Field()
  expectedBirthStartDate: Date;

  @Field()
  expectedBirthEndDate: Date;

  @Field(() => BreedingStatus)
  status: BreedingStatus;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}