import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { AssessRematingInput, RematingAssessmentModel, RematingContextModel } from './remating.models.js';
import { RematingService } from './remating.service.js';

@Resolver()
@UseGuards(JwtAuthGuard)
export class RematingResolver {
  constructor(private readonly remating: RematingService) {}

  @Query(() => RematingContextModel, { description: 'Ce que l’app sait de la femelle avant le questionnaire de ressaillie' })
  rematingContext(@CurrentUser() user: CurrentUserType, @Args('femaleId', { type: () => ID }) femaleId: string) {
    return this.remating.context(femaleId, user);
  }

  @Mutation(() => RematingAssessmentModel, { description: 'La femelle est-elle prête pour une nouvelle saillie ?' })
  assessRemating(@CurrentUser() user: CurrentUserType, @Args('input') input: AssessRematingInput) {
    return this.remating.assess(input, user);
  }
}
