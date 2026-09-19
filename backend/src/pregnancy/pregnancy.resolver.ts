import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PregnancyService } from './pregnancy.service';
import { PregnancyModel } from './models/pregnancy.model';
import { CreatePregnancyCheckInput } from './inputs/create-pregnancy-check.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { FarmRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

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