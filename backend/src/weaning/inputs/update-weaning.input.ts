import { Field, Float, ID, InputType } from '@nestjs/graphql';

/** Correction d'un sevrage (dates, poids, observation). */
@InputType()
export class UpdateWeaningInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  plannedDate?: Date;

  @Field({ nullable: true, description: 'Uniquement pour un sevrage déjà réalisé' })
  actualDate?: Date;

  @Field(() => Float, { nullable: true })
  totalWeight?: number;

  @Field(() => Float, { nullable: true })
  averageWeight?: number;

  @Field({ nullable: true })
  observation?: string;
}
