import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdoptionsService } from './adoptions.service';
import { AdoptionModel } from './models/adoption.model';
import { CreateAdoptionInput } from './inputs/create-adoption.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { FarmRole } from '../generated/prisma/client';

@Resolver(() => AdoptionModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdoptionsResolver {
  constructor(
    private readonly adoptionsService: AdoptionsService,
  ) {}

  @Mutation(() => AdoptionModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
    FarmRole.EMPLOYEE,
  )
  async createAdoption(
    @Args('input') input: CreateAdoptionInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.adoptionsService.create(
      input,
      currentUser,
    );
  }

  @Query(() => [AdoptionModel])
  async adoptions(
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.adoptionsService.findAll(currentUser);
  }

  @Query(() => [AdoptionModel])
  async litterAdoptions(
    @Args('litterId', { type: () => ID }) litterId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.adoptionsService.findByLitter(
      litterId,
      currentUser,
    );
  }
}