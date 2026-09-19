import { Field, ID, InputType } from '@nestjs/graphql';
import { PregnancyResult } from '../graphql/pregnancy-result.enum';

@InputType()
export class CreatePregnancyCheckInput {
  @Field(() => ID)
  breedingId: string;

  @Field()
  checkedDate: Date;

  @Field(() => PregnancyResult)
  result: PregnancyResult;

  @Field({ nullable: true })
  observation?: string;
}