import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { AppRatingModel, PlatformStatsModel } from './platform.models.js';
import { PlatformService } from './platform.service.js';

@Resolver()
@UseGuards(JwtAuthGuard)
export class PlatformResolver {
  constructor(private readonly platform: PlatformService) {}

  @Mutation(() => AppRatingModel, { description: 'Noter l’application (1 à 5 étoiles)' })
  rateApp(
    @CurrentUser() user: CurrentUserType,
    @Args('stars', { type: () => Int }) stars: number,
    @Args('comment', { type: () => String, nullable: true }) comment?: string,
  ) {
    return this.platform.rate(user, stars, comment);
  }

  @Query(() => AppRatingModel, { nullable: true })
  myAppRating(@CurrentUser() user: CurrentUserType) {
    return this.platform.myRating(user);
  }

  @Query(() => Boolean, { description: 'La personne connectée est-elle propriétaire de l’app ?' })
  isPlatformAdmin(@CurrentUser() user: CurrentUserType) {
    return this.platform.isAdmin(user);
  }

  @Query(() => PlatformStatsModel)
  platformStats(@CurrentUser() user: CurrentUserType) {
    return this.platform.stats(user);
  }
}
