import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PregnancyResult } from '../graphql/pregnancy-result.enum';

@ObjectType()
export class PregnancyModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  breedingId: string;

  @Field()
  checkedDate: Date;

  @Field(() => PregnancyResult)
  result: PregnancyResult;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}