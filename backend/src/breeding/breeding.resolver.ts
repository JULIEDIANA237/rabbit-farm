import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { BreedingService } from './breeding.service.js';
import { BreedingModel } from './models/breeding.model.js';
import { NestInstallationModel } from './models/nest-installation.model.js';
import { CreateBreedingInput } from './inputs/create-breeding.input.js';
import { RecordNestInstallationInput } from './inputs/record-nest-installation.input.js';
import { UpdateBreedingInput } from './inputs/update-breeding.input.js';
import { CancelBreedingInput } from './inputs/cancel-breeding.input.js';
import { BreedingStatus } from './graphql/breeding-status.enum.js';
import { ReproductionProfileModel } from './models/reproduction-profile.model.js';
import { MatingContextModel } from './models/mating.models.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { FarmRole } from '../generated/prisma/client.js';

@Resolver(() => BreedingModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BreedingResolver {
  constructor(
    private readonly breedingService: BreedingService,
  ) {}

  @Query(() => ReproductionProfileModel, { description: 'Résumé d’un reproducteur avant une saillie' })
  async reproductionProfile(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.reproductionProfile(rabbitId, currentUser);
  }

  @Query(() => MatingContextModel, { description: 'Charge du mâle sur 24 h et accouplement du jour de la femelle' })
  async matingContext(
    @Args('date') date: Date,
    @CurrentUser() currentUser: CurrentUserType,
    @Args('femaleId', { type: () => ID, nullable: true }) femaleId?: string,
    @Args('maleId', { type: () => ID, nullable: true }) maleId?: string,
  ) {
    return this.breedingService.matingContext(femaleId, maleId, new Date(date), currentUser);
  }

  @Query(() => [BreedingModel])
  async breedings(
    @Args('status', { type: () => BreedingStatus, nullable: true })
    status: BreedingStatus | undefined,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.findAll(currentUser, status);
  }

  @Query(() => BreedingModel)
  async breeding(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.findOne(id, currentUser);
  }

  @Mutation(() => BreedingModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async createBreeding(
    @Args('input') input: CreateBreedingInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.create(input, currentUser);
  }

  @Mutation(() => BreedingModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async cancelBreeding(
    @Args('input') input: CancelBreedingInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.cancel(input, currentUser);
  }

  @Mutation(() => NestInstallationModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  async recordNestInstallation(
    @Args('input') input: RecordNestInstallationInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.recordNestInstallation(input, currentUser);
  }

  @Mutation(() => BreedingModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async updateBreeding(
    @Args('input') input: UpdateBreedingInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.update(input, currentUser);
  }

  @Mutation(() => Boolean)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  async deleteBreeding(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.breedingService.remove(id, currentUser);
  }
}
