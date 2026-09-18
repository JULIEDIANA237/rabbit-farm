
import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { FarmsService } from './farms.service';
import { FarmModel } from './models/farm.model';
import { CreateFarmInput } from './dto/create-farm.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
   * Pour le moment, cette mutation reste publique
   * car elle est utilisée lors de la création initiale
   * d'un compte/ferme.
   */
  @Mutation(() => FarmModel)
  async createFarm(
    @Args('input') input: CreateFarmInput,
  ): Promise<FarmModel> {
    return this.farmsService.create(input);
  }

  /**
   * Retourne uniquement les fermes auxquelles
   * l'utilisateur authentifié a accès.
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => [FarmModel])
  async farms(
    @CurrentUser() user: CurrentUserType,
  ): Promise<FarmModel[]> {
    return this.farmsService.findAll(user);
  }

  /**
   * Retourne une ferme uniquement si l'utilisateur
   * authentifié en est membre.
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => FarmModel, { nullable: true })
  async farm(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserType,
  ): Promise<FarmModel | null> {
    return this.farmsService.findOne(id, user);
  }
}

