import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { LitterModel } from './litter.model';
import { RabbitSex } from '../../rabbits/graphql/rabbit-sex.enum';
import { RabbitStatus } from '../../rabbits/graphql/rabbit-status.enum';

@ObjectType()
export class LitterKitModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => String, { nullable: true })
  originalCode?: string | null;

  @Field(() => RabbitSex)
  sex: RabbitSex;

  @Field(() => RabbitStatus)
  status: RabbitStatus;

  @Field(() => ID, { nullable: true })
  currentCageId?: string | null;

  @Field(() => String, { nullable: true })
  currentCageCode?: string | null;

  @Field(() => String, { nullable: true })
  currentLotCode?: string | null;

  @Field(() => String, {
    nullable: true,
    description: "Portée d'élevage (mère nourricière) si le lapereau a été adopté",
  })
  rearingLitterCode?: string | null;
}

@ObjectType()
export class CageDistributionModel {
  @Field(() => ID)
  cageId: string;

  @Field()
  cageCode: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class LitterEventModel {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  date: Date;

  @Field()
  label: string;

  @Field(() => Int, { nullable: true })
  quantity?: number | null;

  @Field(() => Float, { nullable: true })
  weight?: number | null;
}

@ObjectType()
export class LitterDetailModel {
  @Field(() => LitterModel)
  litter: LitterModel;

  @Field(() => [LitterKitModel])
  kits: LitterKitModel[];

  @Field(() => [CageDistributionModel])
  cageDistribution: CageDistributionModel[];

  @Field(() => [LitterEventModel], {
    description: 'Adoptions, mortalités, sevrages et ventes, du plus récent au plus ancien',
  })
  events: LitterEventModel[];

  @Field(() => Int)
  deaths: number;

  @Field(() => Int)
  weaned: number;

  @Field(() => Int)
  sold: number;

  @Field(() => Float, { nullable: true })
  survivalRate?: number | null;
}
