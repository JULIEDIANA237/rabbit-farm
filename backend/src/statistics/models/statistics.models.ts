import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LabeledValueModel {
  @Field()
  label: string;

  @Field(() => Float)
  value: number;
}

@ObjectType()
export class WeightByAgeModel {
  @Field()
  label: string;

  @Field(() => Int)
  sampleCount: number;

  @Field(() => Float, { nullable: true })
  averageWeight: number | null;
}

@ObjectType()
export class BreederPerformanceModel {
  @Field(() => ID)
  rabbitId: string;

  @Field()
  rabbitCode: string;

  @Field(() => Int)
  litters: number;

  @Field(() => Int)
  bornAlive: number;

  @Field(() => Int)
  stillBorn: number;

  @Field(() => Int)
  deaths: number;

  @Field(() => Int)
  weaned: number;

  @Field(() => Float, { nullable: true })
  averageLitterSize: number | null;

  @Field(() => Float, { nullable: true })
  survivalRate: number | null;

  @Field(() => Float, { nullable: true })
  weaningRate: number | null;
}

@ObjectType()
export class TechnicalStatisticsModel {
  @Field(() => Int)
  breedings: number;

  @Field(() => Int)
  palpations: number;

  @Field(() => Int)
  positivePalpations: number;

  @Field(() => Float, { nullable: true, description: 'Palpations positives / palpations (%)' })
  fertilityRate: number | null;

  @Field(() => Int)
  births: number;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int)
  stillBorn: number;

  @Field(() => Float, { nullable: true })
  averageLitterSize: number | null;

  @Field(() => Float, { nullable: true, description: 'Mort-nés / nés totaux (%)' })
  stillBirthRate: number | null;

  @Field(() => Int)
  preWeaningDeaths: number;

  @Field(() => Float, { nullable: true })
  preWeaningMortalityRate: number | null;

  @Field(() => Int)
  weaned: number;

  @Field(() => Float, { nullable: true, description: 'Sevrés / nés vivants (%)' })
  weaningRate: number | null;

  @Field(() => Float, { nullable: true })
  averageWeaningWeight: number | null;

  @Field(() => Int)
  fatteningDeaths: number;

  @Field(() => Int)
  totalDeaths: number;

  @Field(() => [LabeledValueModel])
  deathsByCause: LabeledValueModel[];

  @Field(() => [WeightByAgeModel])
  weightByAge: WeightByAgeModel[];
}

@ObjectType()
export class GeneticStatisticsModel {
  @Field(() => [BreederPerformanceModel])
  bestMothers: BreederPerformanceModel[];

  @Field(() => [BreederPerformanceModel])
  bestFathers: BreederPerformanceModel[];

  @Field(() => Int)
  blockedPairs: number;

  @Field(() => Int)
  riskyPairs: number;

  @Field(() => [LabeledValueModel])
  breedDistribution: LabeledValueModel[];
}

@ObjectType()
export class MonthlyFinanceModel {
  @Field()
  month: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  expenses: number;

  @Field(() => Float)
  margin: number;
}

@ObjectType()
export class FinanceStatisticsModel {
  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  collected: number;

  @Field(() => Float)
  outstanding: number;

  @Field(() => Float)
  expenses: number;

  @Field(() => Float)
  margin: number;

  @Field(() => Int)
  rabbitsSold: number;

  @Field(() => Float)
  kgSold: number;

  @Field(() => Float, { nullable: true })
  estimatedCostPerKg: number | null;

  @Field(() => [LabeledValueModel])
  expensesByCategory: LabeledValueModel[];

  @Field(() => [MonthlyFinanceModel])
  monthly: MonthlyFinanceModel[];
}

@ObjectType()
export class PopulationStatisticsModel {
  @Field(() => Int)
  active: number;

  @Field(() => [LabeledValueModel])
  bySex: LabeledValueModel[];

  @Field(() => [LabeledValueModel])
  byPurpose: LabeledValueModel[];

  @Field(() => [LabeledValueModel])
  exits: LabeledValueModel[];
}

@ObjectType()
export class FarmStatisticsModel {
  @Field()
  from: Date;

  @Field()
  to: Date;

  @Field(() => TechnicalStatisticsModel)
  technical: TechnicalStatisticsModel;

  @Field(() => GeneticStatisticsModel)
  genetic: GeneticStatisticsModel;

  @Field(() => FinanceStatisticsModel)
  finance: FinanceStatisticsModel;

  @Field(() => PopulationStatisticsModel)
  population: PopulationStatisticsModel;
}
