import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

/**
 * Saillie faite il y a 65 jours ou plus, saisie après coup : la mise bas,
 * le sevrage et l'entrée en engraissement sont enregistrés en même temps.
 */
@InputType()
export class RecordPastBreedingInput {
  @Field(() => ID)
  femaleId: string;

  @Field(() => ID)
  maleId: string;

  @Field()
  breedingDate: Date;

  @Field({ nullable: true })
  observation?: string;

  @Field({ nullable: true, defaultValue: false })
  acknowledgeWarnings?: boolean;

  @Field({ nullable: true, description: 'Date de mise bas (par défaut : saillie + 31 jours)' })
  birthDate?: Date;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  stillBorn?: number;

  @Field(() => Int, { description: 'Lapereaux sevrés ; les autres nés vivants sont morts avant le sevrage' })
  weanedCount: number;

  @Field({ nullable: true, description: 'Date du sevrage (par défaut : mise bas + 35 jours)' })
  weaningDate?: Date;

  @Field(() => ID, { nullable: true, description: 'Lot existant ; sinon un lot est créé pour la portée' })
  fatteningLotId?: string;

  @Field(() => ID, { nullable: true, description: "Cage d'engraissement où loger le lot" })
  cageId?: string;

  @Field(() => Float, { nullable: true, description: 'Poids moyen au sevrage (kg)' })
  averageWeight?: number;
}
