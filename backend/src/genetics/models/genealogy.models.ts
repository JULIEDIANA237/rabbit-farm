import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { CompatibilityLevel } from '../graphql/compatibility-level.enum';
import { RabbitSummaryModel } from '../../common/models/rabbit-summary.model';
import { RabbitSex } from '../../rabbits/graphql/rabbit-sex.enum';
import { RabbitStatus } from '../../rabbits/graphql/rabbit-status.enum';

@ObjectType()
export class CompatibilityReasonModel {
  @Field()
  code: string;

  @Field(() => CompatibilityLevel)
  level: CompatibilityLevel;

  @Field()
  message: string;
}

@ObjectType()
export class BreedingCompatibilityModel {
  @Field(() => ID)
  femaleId: string;

  @Field(() => ID)
  maleId: string;

  @Field()
  femaleCode: string;

  @Field()
  maleCode: string;

  @Field(() => CompatibilityLevel)
  level: CompatibilityLevel;

  @Field(() => [CompatibilityReasonModel])
  reasons: CompatibilityReasonModel[];

  @Field(() => [RabbitSummaryModel])
  commonAncestors: RabbitSummaryModel[];

  @Field(() => Float, {
    description:
      'Coefficient de consanguinité estimé du produit (0 à 1), basé sur la généalogie connue.',
  })
  inbreedingCoefficient: number;
}

@ObjectType()
export class PedigreeNodeModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => RabbitSex)
  sex: RabbitSex;

  @Field(() => RabbitStatus)
  status: RabbitStatus;

  @Field(() => Date, { nullable: true })
  birthDate?: Date | null;

  @Field(() => String, { nullable: true })
  breedName?: string | null;

  @Field(() => PedigreeNodeModel, { nullable: true })
  father?: PedigreeNodeModel | null;

  @Field(() => PedigreeNodeModel, { nullable: true })
  mother?: PedigreeNodeModel | null;
}

@ObjectType()
export class DescendantModel extends RabbitSummaryModel {
  @Field(() => Int)
  generation: number;

  @Field(() => ID, { nullable: true })
  fatherId?: string | null;

  @Field(() => ID, { nullable: true })
  motherId?: string | null;
}
