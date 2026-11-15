import { Args, Field, Float, ID, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../../auth/types/current-user.type.js';
import { FarmRole } from '../../generated/prisma/client.js';

import { SaleReadinessService } from './sale-readiness.service.js';

@ObjectType()
export class SaleCriteriaModel {
  @Field(() => Int)
  minAgeDays: number;

  @Field(() => Float)
  minWeightKg: number;
}

@ObjectType()
export class SaleCandidateModel {
  @Field(() => ID)
  rabbitId: string;

  @Field()
  code: string;

  @Field()
  sex: string;

  @Field()
  purpose: string;

  @Field(() => Int, { nullable: true })
  ageDays: number | null;

  @Field(() => Float, { nullable: true })
  weight: number | null;

  @Field(() => String, { nullable: true })
  weightSource: string | null;

  @Field(() => Date, { nullable: true })
  weighedAt: Date | null;

  @Field(() => ID, { nullable: true })
  lotId: string | null;

  @Field(() => String, { nullable: true })
  lotCode: string | null;

  @Field(() => String, { nullable: true })
  cageCode: string | null;

  @Field(() => Boolean)
  manual: boolean;

  @Field(() => [String])
  reasons: string[];
}

@ObjectType()
export class SaleReadinessModel {
  @Field(() => SaleCriteriaModel)
  criteria: SaleCriteriaModel;

  @Field(() => [SaleCandidateModel])
  ready: SaleCandidateModel[];

  @Field(() => [SaleCandidateModel], { description: 'Prêts dans les 14 prochains jours' })
  soon: SaleCandidateModel[];
}

@Resolver(() => SaleReadinessModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaleReadinessResolver {
  constructor(private readonly readiness: SaleReadinessService) {}

  @Query(() => SaleReadinessModel, { description: 'Lapins prêts pour la vente' })
  saleReadiness(@CurrentUser() currentUser: CurrentUserType) {
    return this.readiness.list(currentUser.farmId);
  }

  @Mutation(() => Int, { description: 'Marque (ou retire) des lapins comme prêts pour la vente' })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  setRabbitsReadyForSale(
    @Args('rabbitIds', { type: () => [ID] }) rabbitIds: string[],
    @Args('ready', { type: () => Boolean }) ready: boolean,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.readiness.setManual(rabbitIds, ready, currentUser);
  }

  @Mutation(() => SaleCriteriaModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  updateSaleCriteria(
    @Args('minAgeDays', { type: () => Int }) minAgeDays: number,
    @Args('minWeightKg', { type: () => Float }) minWeightKg: number,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.readiness.updateCriteria(minAgeDays, minWeightKg, currentUser);
  }
}
