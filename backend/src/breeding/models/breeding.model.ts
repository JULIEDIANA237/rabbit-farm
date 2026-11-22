import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { BreedingStatus } from '../graphql/breeding-status.enum.js';
import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model.js';
import { NestInstallationModel } from './nest-installation.model.js';
import { BreedingMatingModel } from './mating.models.js';

@ObjectType()
export class BreedingModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  femaleId: string;

  @Field(() => ID)
  maleId: string;

  @Field(() => RabbitSummaryModel, { nullable: true })
  female?: RabbitSummaryModel | null;

  @Field(() => RabbitSummaryModel, { nullable: true })
  male?: RabbitSummaryModel | null;

  @Field()
  breedingDate: Date;

  @Field()
  palpationStartDate: Date;

  @Field()
  palpationEndDate: Date;

  @Field()
  nestDate: Date;

  @Field()
  expectedBirthStartDate: Date;

  @Field()
  expectedBirthEndDate: Date;

  @Field(() => BreedingStatus)
  status: BreedingStatus;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => NestInstallationModel, { nullable: true })
  nestInstallation?: NestInstallationModel | null;

  @Field(() => [BreedingMatingModel], { description: 'Saillies supplémentaires du même jour' })
  matings: BreedingMatingModel[];

  @Field(() => Int, { description: 'Nombre total de saillies (la première comprise)' })
  matingCount: number;

  @Field(() => ID, { nullable: true, description: 'Naissance enregistrée' })
  birthId?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
