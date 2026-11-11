import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PregnancyService } from './pregnancy.service.js';
import { PregnancyModel } from './models/pregnancy.model.js';
import { CreatePregnancyCheckInput } from './inputs/create-pregnancy-check.input.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { FarmRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Resolver(() => PregnancyModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PregnancyResolver {
  constructor(
    private readonly pregnancyService: PregnancyService,
  ) {}

  @Mutation(() => PregnancyModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async createPregnancyCheck(
    @Args('input')
    input: CreatePregnancyCheckInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.pregnancyService.createCheck(
      input,
      currentUser,
    );
  }

  @Query(() => [PregnancyModel])
  async pregnancies(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.pregnancyService.findAll(
      currentUser,
    );
  }

  @Query(() => [PregnancyModel])
  async pregnancyChecksByBreeding(
    @Args('breedingId', { type: () => ID })
    breedingId: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.pregnancyService.findByBreeding(
      breedingId,
      currentUser,
    );
  }
}