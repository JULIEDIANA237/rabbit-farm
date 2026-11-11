import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { BirthsService } from './births.service.js';
import { BirthModel } from './models/birth.model.js';
import { CreateBirthInput } from './inputs/create-birth.input.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { FarmRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Resolver(() => BirthModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BirthsResolver {
  constructor(
    private readonly birthsService: BirthsService,
  ) {}

  @Mutation(() => BirthModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async createBirth(
    @Args('input')
    input: CreateBirthInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.birthsService.create(
      input,
      currentUser,
    );
  }

  @Query(() => [BirthModel])
  async births(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.birthsService.findAll(
      currentUser,
    );
  }

  @Query(() => BirthModel)
  async birth(
    @Args('id', { type: () => ID })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.birthsService.findOne(
      id,
      currentUser,
    );
  }
}