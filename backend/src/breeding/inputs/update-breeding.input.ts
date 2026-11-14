import { Field, ID, InputType } from '@nestjs/graphql';

/** Correction d'un accouplement (date, mâle, observation). */
@InputType()
export class UpdateBreedingInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  maleId?: string;

  @Field({ nullable: true })
  breedingDate?: Date;

  @Field({ nullable: true })
  observation?: string;

  @Field({ nullable: true, defaultValue: false })
  acknowledgeWarnings?: boolean;
}
