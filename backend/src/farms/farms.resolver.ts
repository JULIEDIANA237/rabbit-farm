import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { FarmRole } from '../generated/prisma/client';

import { FarmModel } from './models/farm.model';
import { CreateFarmInput } from './dto/create-farm.input';

import { FarmsService } from './farms.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import type { CurrentUserType } from '../auth/types/current-user.type';

@Resolver(() => FarmModel)
export class FarmsResolver {
  constructor(
    private readonly farmsService: FarmsService,
  ) {}

  /**
   * Création d'une ferme.
   *
   * Pour l'instant, cette mutation reste disponible
   * mais nous devrons la revoir avec le système
   * d'administration/membership.
   */
  @Mutation(() => FarmModel)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(FarmRole.ADMIN)
  async createFarm(
    @Args('input')
    input: CreateFarmInput,
  ) {
    return this.farmsService.create(input);
  }

  /**
   * Récupère la ferme courante.
   */
  @Query(() => [FarmModel])
  @UseGuards(
    JwtAuthGuard,
  )
  async farms(
    @CurrentUser()
    user: CurrentUserType,
  ) {
    return this.farmsService.findAll(user);
  }

  /**
   * Récupère une ferme précise,
   * uniquement si l'utilisateur en est membre.
   */
  @Query(() => FarmModel, {
    nullable: true,
  })
  @UseGuards(
    JwtAuthGuard,
  )
  async farm(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @CurrentUser()
    user: CurrentUserType,
  ) {
    return this.farmsService.findOne(
      id,
      user,
    );
  }
}