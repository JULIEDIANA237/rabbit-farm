import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { AdvisorService } from './advisor.service.js';
import { FarmSuggestionModel } from './suggestion.model.js';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AdvisorResolver {
  constructor(private readonly advisor: AdvisorService) {}

  @Query(() => [FarmSuggestionModel], { description: 'À faire, à prévoir et suggestions pour la ferme' })
  async farmSuggestions(@CurrentUser() user: CurrentUserType) {
    return this.advisor.suggestions(user);
  }
}
