import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LittersService } from './litters.service';
import { LitterModel } from './models/litter.model';
import { CreateLitterInput } from './inputs/create-litter.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { Roles } from '../auth/decorators/roles.decorator';

import { FarmRole } from '../generated/prisma/client';

import { CreateLitterRabbitsInput } from './inputs/create-litter-rabbits.input';
import { RabbitModel } from '../rabbits/models/rabbit.model';

import { RabbitCageMovementModel } from '../rabbits/models/rabbit-cage-movement.model';

import { AssignLitterRabbitsToCageInput } from './inputs/assign-litter-rabbits-to-cage.input';

@Resolver(() => LitterModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class LittersResolver {
  constructor(
    private readonly littersService: LittersService,
  ) {}

  @Mutation(() => LitterModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async createLitter(
    @Args('input')
    input: CreateLitterInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.littersService.create(
      input,
      currentUser,
    );
  }

  @Query(() => [LitterModel])
  async litters(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.littersService.findAll(
      currentUser,
    );
  }

  @Query(() => LitterModel, { nullable: true })
  async litter(
    @Args('id', { type: () => ID })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.littersService.findOne(
      id,
      currentUser,
    );
  }

  @Query(() => LitterModel, { nullable: true })
  async litterByBirth(
    @Args('birthId', { type: () => ID })
    birthId: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.littersService.findByBirth(
      birthId,
      currentUser,
    );
  }

  @Mutation(() => [RabbitModel])
@Roles(
  FarmRole.ADMIN,
  FarmRole.BREEDING_MANAGER,
)
async createLitterRabbits(
  @Args('input')
  input: CreateLitterRabbitsInput,

  @CurrentUser()
  currentUser: CurrentUserType,
) {
  return this.littersService.createRabbits(
    input,
    currentUser,
  );
}

@Mutation(() => [RabbitCageMovementModel])
@Roles(
  FarmRole.ADMIN,
  FarmRole.BREEDING_MANAGER,
  FarmRole.EMPLOYEE,
)
async assignLitterRabbitsToCage(
  @Args('input')
  input: AssignLitterRabbitsToCageInput,

  @CurrentUser()
  currentUser: CurrentUserType,
) {
  return this.littersService.assignRabbitsToCage(
    input,
    currentUser,
  );
}
}