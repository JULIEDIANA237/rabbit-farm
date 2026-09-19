import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { BirthsService } from './births.service';
import { BirthModel } from './models/birth.model';
import { CreateBirthInput } from './inputs/create-birth.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { FarmRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

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