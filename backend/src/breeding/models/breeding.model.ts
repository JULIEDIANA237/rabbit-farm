import { Field, ID, ObjectType } from '@nestjs/graphql';

import { BreedingStatus } from '../graphql/breeding-status.enum.js';
import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model.js';
import { NestInstallationModel } from './nest-installation.model.js';

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

  @Field(() => ID, { nullable: true, description: 'Naissance enregistrée' })
  birthId?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
