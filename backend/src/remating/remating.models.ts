import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RematingContextModel {
  @Field(() => ID) femaleId: string;
  @Field() femaleCode: string;
  @Field(() => Date, { nullable: true }) lastBirthDate?: Date | null;
  @Field(() => Int, { nullable: true }) daysSinceBirth?: number | null;
  @Field(() => Int, { description: 'Lapereaux encore allaités' }) kitsNursing: number;
  @Field(() => Float, { nullable: true }) lastWeightKg?: number | null;
  @Field(() => ID, { nullable: true, description: 'Tâche « ressaillie » ouverte' }) taskId?: string | null;
}

@ObjectType()
export class RematingAssessmentModel {
  @Field({ description: 'READY (prête), WAIT (attendre un peu) ou NOT_READY (pas prête)' }) verdict: string;
  @Field() title: string;
  @Field(() => Int) waitDays: number;
  @Field(() => [String]) reasons: string[];
  @Field(() => [String]) advice: string[];
  @Field(() => Date, { nullable: true, description: 'Nouvelle date de la tâche si elle est reportée' }) nextCheck?: Date | null;
}

@InputType()
export class AssessRematingInput {
  @Field(() => ID) femaleId: string;
  @Field(() => Float, { nullable: true }) weightKg?: number;
  @Field({ description: 'THIN (maigre), GOOD (bon état) ou FAT (grasse)' }) bodyCondition: string;
  @Field() mastitis: boolean;
  @Field() sick: boolean;
  @Field() goodAppetite: boolean;
  @Field({ description: 'PALE, PINK, RED ou UNKNOWN' }) vulva: string;
}
