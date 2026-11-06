import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { DashboardTaskModel } from './dashboard-task.model';
import { DashboardBreedingActionModel } from './dashboard-breeding-action.model';
import { DashboardBirthModel } from './dashboard-birth.model';
import { DashboardWeaningModel } from './dashboard-weaning.model';
import { DashboardStockAlertModel } from './dashboard-stock-alert.model';
import { DashboardHealthActionModel } from './dashboard-health-action.model';

@ObjectType()
export class DashboardModel {
  @Field()
  date: Date;

  // =========================
  // POPULATION
  // =========================

  @Field(() => Int)
  totalRabbits: number;

  @Field(() => Int)
  activeRabbits: number;

  @Field(() => Int)
  breedingMales: number;

  @Field(() => Int)
  breedingFemales: number;

  @Field(() => Int)
  youngRabbits: number;

  // =========================
  // ACTIONS
  // =========================

  @Field(() => Int)
  overdueTasks: number;

  @Field(() => Int)
  tasksToday: number;

  @Field(() => Int)
  urgentTasks: number;

  @Field(() => Int)
  femalesToPalpate: number;

  @Field(() => Int)
  nestsToInstall: number;

  @Field(() => Int)
  expectedBirths: number;

  @Field(() => Int)
  recentBirths: number;

  @Field(() => Int)
  plannedWeanings: number;

  @Field(() => Int)
  lowStockItems: number;

  @Field(() => Int)
  healthActions: number;

  // =========================
  // CAGES
  // =========================

  @Field(() => Int)
  totalCages: number;

  @Field(() => Int)
  occupiedCages: number;

  // =========================
  // INDICATEURS TECHNIQUES
  // =========================

  @Field(() => Int)
  birthsThisMonth: number;

  @Field(() => Int)
  kitsBornThisMonth: number;

  @Field(() => Float, { nullable: true })
  averageLitterSize?: number;

  @Field(() => Float, { nullable: true })
  breedingSuccessRate?: number;

  // =========================
  // FINANCES
  // =========================

  @Field(() => Float)
  monthlyExpenses: number;

  @Field(() => Float)
  monthlyRevenue: number;

  // =========================
  // DETAILS
  // =========================

  @Field(() => [DashboardTaskModel])
  urgentTaskList: DashboardTaskModel[];

  @Field(() => [DashboardBreedingActionModel])
  palpationList: DashboardBreedingActionModel[];

  @Field(() => [DashboardBreedingActionModel])
  nestInstallationList: DashboardBreedingActionModel[];

  @Field(() => [DashboardBreedingActionModel])
  expectedBirthList: DashboardBreedingActionModel[];

  @Field(() => [DashboardBirthModel])
  recentBirthList: DashboardBirthModel[];

  @Field(() => [DashboardWeaningModel])
  weaningList: DashboardWeaningModel[];

  @Field(() => [DashboardStockAlertModel])
  lowStockList: DashboardStockAlertModel[];

  @Field(() => [DashboardHealthActionModel])
  healthActionList: DashboardHealthActionModel[];
}