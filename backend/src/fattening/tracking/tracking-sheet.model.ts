import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SheetEventModel {
  @Field()
  date: Date;

  @Field()
  label: string;
}

@ObjectType()
export class SheetLitterModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  motherCode?: string;

  @Field({ nullable: true })
  fatherCode?: string;

  @Field(() => Date, { nullable: true })
  breedingDate?: Date | null;

  @Field(() => Date, { nullable: true, description: 'Première palpation positive' })
  pregnancyConfirmedDate?: Date | null;

  @Field(() => Date, { nullable: true })
  nestDate?: Date | null;

  @Field()
  birthDate: Date;

  @Field(() => Int, { nullable: true, description: 'Jours entre la saillie et la mise bas' })
  gestationDays?: number | null;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int)
  stillBorn: number;

  @Field(() => Date, { nullable: true })
  weaningDate?: Date | null;

  @Field(() => Int, { nullable: true, description: 'Âge des lapereaux au sevrage (jours)' })
  weaningAgeDays?: number | null;

  @Field(() => Int)
  weaned: number;

  @Field(() => Float, { nullable: true })
  weaningAverageWeight?: number | null;

  @Field(() => Int, { description: 'Morts entre la naissance et le sevrage' })
  deathsBeforeWeaning: number;

  @Field(() => [SheetEventModel], { description: 'Toutes les étapes, dans l’ordre' })
  events: SheetEventModel[];
}

@ObjectType()
export class SheetWeighingModel {
  @Field()
  date: Date;

  @Field(() => Int)
  animalCount: number;

  @Field(() => Float)
  totalWeight: number;

  @Field(() => Float, { nullable: true })
  averageWeight?: number | null;

  @Field(() => Int, { nullable: true })
  ageInDays?: number | null;

  @Field(() => Float, { nullable: true, description: 'Gain moyen quotidien depuis la pesée précédente (g/jour)' })
  dailyGainGrams?: number | null;
}

@ObjectType()
export class TrackingSheetModel {
  @Field(() => ID)
  lotId: string;

  @Field()
  lotCode: string;

  @Field()
  lotStatus: string;

  @Field()
  entryDate: Date;

  @Field(() => Date, { nullable: true })
  exitDate?: Date | null;

  @Field({ nullable: true })
  currentCageCode?: string;

  @Field(() => Int)
  enteredCount: number;

  @Field(() => Int)
  activeCount: number;

  @Field(() => Int)
  deadInLot: number;

  @Field(() => Int)
  soldCount: number;

  @Field(() => Float, { nullable: true })
  soldWeight?: number | null;

  @Field(() => Float, { nullable: true })
  salesAmount?: number | null;

  @Field(() => [SheetLitterModel])
  litters: SheetLitterModel[];

  @Field(() => [SheetWeighingModel])
  weighings: SheetWeighingModel[];

  @Field(() => [SheetEventModel], { description: 'Mortalités, déplacements et ventes du lot' })
  lotEvents: SheetEventModel[];

  @Field(() => Float, { nullable: true, description: 'GMQ global depuis la première pesée (g/jour)' })
  overallDailyGainGrams?: number | null;
}
