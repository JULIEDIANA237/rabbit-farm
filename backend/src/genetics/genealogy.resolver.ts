import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { GenealogyService } from './genealogy.service';
import {
  BreedingCompatibilityModel,
  DescendantModel,
  PedigreeNodeModel,
} from './models/genealogy.models';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class GenealogyResolver {
  constructor(private readonly genealogyService: GenealogyService) {}

  /**
   * Contrôle généalogique avant accouplement (§18, §63).
   */
  @Query(() => BreedingCompatibilityModel)
  breedingCompatibility(
    @Args('femaleId', { type: () => ID }) femaleId: string,
    @Args('maleId', { type: () => ID }) maleId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.genealogyService.checkBreedingCompatibility(
      femaleId,
      maleId,
      currentUser,
    );
  }

  /**
   * Arbre généalogique ascendant (père, mère, grands-parents...).
   */
  @Query(() => PedigreeNodeModel)
  rabbitPedigree(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @Args('generations', { type: () => Int, defaultValue: 3 })
    generations: number,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.genealogyService.pedigree(rabbitId, generations, currentUser);
  }

  /**
   * Descendants d'un lapin.
   */
  @Query(() => [DescendantModel])
  rabbitDescendants(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @Args('generations', { type: () => Int, defaultValue: 3 })
    generations: number,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.genealogyService.descendants(
      rabbitId,
      generations,
      currentUser,
    );
  }

  /**
   * Croisements interdits ou à risque entre reproducteurs actifs (§52).
   */
  @Query(() => [BreedingCompatibilityModel])
  riskyBreedingPairs(
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.genealogyService.riskyPairs(currentUser, limit);
  }
}
