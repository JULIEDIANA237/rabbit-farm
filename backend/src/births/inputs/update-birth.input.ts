import { Field, ID, InputType, Int } from '@nestjs/graphql';

/** Correction d'une mise bas (date, mort-nés, observation). */
@InputType()
export class UpdateBirthInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => Int, { nullable: true })
  stillBorn?: number;

  @Field({ nullable: true })
  observation?: string;
}
