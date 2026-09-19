import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { BreedingService } from './breeding.service';
import { BreedingModel } from './models/breeding.model';
import { CreateBreedingInput } from './inputs/create-breeding.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { FarmRole } from '../generated/prisma/client';

@Resolver(() => BreedingModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BreedingResolver {
  constructor(
    private readonly breedingService: BreedingService,
  ) {}

  @Query(() => [BreedingModel])
  async breedings(
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.findAll(currentUser);
  }

  @Query(() => BreedingModel)
  async breeding(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.findOne(
      id,
      currentUser,
    );
  }

  @Mutation(() => BreedingModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async createBreeding(
    @Args('input') input: CreateBreedingInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.create(
      input,
      currentUser,
    );
  }
}