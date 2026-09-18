import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GeneticsService } from './genetics.service';

import { BreedModel } from './models/breed.model';
import { CrossBreedModel } from './models/cross-breed.model';

import { CreateBreedInput } from './inputs/create-breed.input';
import { UpdateBreedInput } from './inputs/update-breed.input';
import { CreateCrossBreedInput } from './inputs/create-cross-breed.input';
import { UpdateCrossBreedInput } from './inputs/update-cross-breed.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { FarmRole } from '../generated/prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class GeneticsResolver {
  constructor(
    private readonly geneticsService: GeneticsService,
  ) {}

  // ----------------------------
  // BREEDS
  // ----------------------------

  @Query(() => [BreedModel])
  async breeds(
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.findAllBreeds(currentUser);
  }

  @Query(() => BreedModel)
  async breed(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.findBreedById(id, currentUser);
  }

  @Mutation(() => BreedModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async createBreed(
    @Args('input') input: CreateBreedInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.createBreed(input, currentUser);
  }

  @Mutation(() => BreedModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async updateBreed(
    @Args('input') input: UpdateBreedInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.updateBreed(input, currentUser);
  }

  @Mutation(() => Boolean)
  @Roles(FarmRole.ADMIN)
  async deleteBreed(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.deleteBreed(id, currentUser);
  }

  // ----------------------------
  // CROSS-BREEDS
  // ----------------------------

  @Query(() => [CrossBreedModel])
  async crossBreeds(
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.findAllCrossBreeds(currentUser);
  }

  @Query(() => CrossBreedModel)
  async crossBreed(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.findCrossBreedById(
      id,
      currentUser,
    );
  }

  @Mutation(() => CrossBreedModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async createCrossBreed(
    @Args('input') input: CreateCrossBreedInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.createCrossBreed(
      input,
      currentUser,
    );
  }

  @Mutation(() => CrossBreedModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async updateCrossBreed(
    @Args('input') input: UpdateCrossBreedInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.updateCrossBreed(
      input,
      currentUser,
    );
  }

  @Mutation(() => Boolean)
  @Roles(FarmRole.ADMIN)
  async deleteCrossBreed(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.geneticsService.deleteCrossBreed(
      id,
      currentUser,
    );
  }
}