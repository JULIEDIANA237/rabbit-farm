import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfileHealthNote {
  @Field()
  date: Date;

  @Field()
  text: string;
}

/** Résumé d'un reproducteur affiché avant d'enregistrer une saillie. */
@ObjectType()
export class ReproductionProfileModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  sex: string;

  @Field(() => Int, { nullable: true })
  ageDays: number | null;

  @Field(() => Float, { nullable: true })
  weight: number | null;

  @Field(() => Int, { description: 'Mises bas (avant son arrivée + dans l’application)' })
  totalLitters: number;

  @Field(() => Int)
  kitsBornAlive: number;

  @Field(() => Float, { nullable: true })
  averageLiveBorn: number | null;

  @Field(() => Date, { nullable: true })
  lastBirthDate: Date | null;

  @Field(() => Int, { nullable: true })
  daysSinceLastBirth: number | null;

  @Field(() => Int, { description: 'Lapereaux encore sous la mère' })
  nursingKits: number;

  @Field(() => String, { nullable: true })
  maternalBehavior: string | null;

  @Field(() => String, { nullable: true })
  healthHistory: string | null;

  @Field(() => Int, { description: 'Saillies (avant son arrivée + dans l’application)' })
  totalMatings: number;

  @Field(() => Int)
  matingsLast7Days: number;

  @Field(() => Date, { nullable: true })
  lastMatingDate: Date | null;

  @Field(() => Float, { nullable: true, description: 'Part des saillies suivies d’une mise bas (%)' })
  successRate: number | null;

  @Field(() => String, { nullable: true })
  activeBreedingStatus: string | null;

  @Field(() => [ProfileHealthNote])
  recentHealth: ProfileHealthNote[];

  @Field(() => [String], { description: 'Points à vérifier avant la saillie' })
  warnings: string[];
}
