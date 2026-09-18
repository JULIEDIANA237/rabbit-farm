import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { FarmRole } from '../auth/graphql/farm-role.enum';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import type { CurrentUserType } from '../auth/types/current-user.type';

import { CreateCageInput } from './inputs/create-cage.input';
import { UpdateCageInput } from './inputs/update-cage.input';

import { CageModel } from './models/cage.model';

import { CagesService } from './cages.service';

@Resolver(() => CageModel)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class CagesResolver {
  constructor(
    private readonly cagesService: CagesService,
  ) {}

  @Query(() => [CageModel])
  async cages(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.cagesService.findAll(
      currentUser,
    );
  }

  @Query(() => CageModel)
  async cage(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.cagesService.findOne(
      id,
      currentUser,
    );
  }

  @Mutation(() => CageModel)
  @Roles(FarmRole.ADMIN)
  async createCage(
    @Args('input')
    input: CreateCageInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.cagesService.create(
      input,
      currentUser,
    );
  }

  @Mutation(() => CageModel)
  @Roles(FarmRole.ADMIN)
  async updateCage(
    @Args('input')
    input: UpdateCageInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.cagesService.update(
      input,
      currentUser,
    );
  }

  @Mutation(() => CageModel)
  @Roles(FarmRole.ADMIN)
  async deleteCage(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.cagesService.remove(
      id,
      currentUser,
    );
  }
}