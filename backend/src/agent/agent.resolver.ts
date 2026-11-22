import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Throttle } from '../common/throttle/throttle.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { AgentBriefModel, AgentLogModel, AgentOverviewModel, AgentSuggestionModel, AskAgentInput } from './agent.models.js';
import { AgentService } from './agent.service.js';

/** Agent de la propriétaire de l'application : tout est réservé aux administrateurs (vérifié dans le service). */
@UseGuards(JwtAuthGuard)
@Resolver()
export class AgentResolver {
  constructor(private readonly agent: AgentService) {}

  @Query(() => AgentOverviewModel, { description: 'Dernier point du matin et propositions à valider.' })
  agentOverview(@CurrentUser() user: CurrentUserType) {
    return this.agent.overview(user);
  }

  @Query(() => [AgentSuggestionModel], { description: 'Propositions déjà traitées, ignorées ou expirées.' })
  agentHistory(@CurrentUser() user: CurrentUserType) {
    return this.agent.history(user);
  }

  @Query(() => [AgentLogModel], { description: 'Journal de l’agent et des validations.' })
  agentLog(@CurrentUser() user: CurrentUserType) {
    return this.agent.log(user);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AgentBriefModel, { description: 'Relance la tournée de l’agent et réécrit le point.' })
  refreshAgent(@CurrentUser() user: CurrentUserType) {
    return this.agent.refresh(user);
  }

  @Mutation(() => AgentSuggestionModel, { description: 'Valide une proposition (avec le brouillon modifié, si fourni).' })
  approveAgentSuggestion(
    @CurrentUser() user: CurrentUserType,
    @Args('id', { type: () => ID }) id: string,
    @Args('draft', { type: () => String, nullable: true }) draft?: string | null,
  ) {
    return this.agent.approve(user, id, draft);
  }

  @Mutation(() => AgentSuggestionModel)
  dismissAgentSuggestion(@CurrentUser() user: CurrentUserType, @Args('id', { type: () => ID }) id: string) {
    return this.agent.dismiss(user, id);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AgentSuggestionModel, { description: 'Réécrit le brouillon avec l’IA.' })
  improveAgentDraft(
    @CurrentUser() user: CurrentUserType,
    @Args('id', { type: () => ID }) id: string,
    @Args('draft', { type: () => String, nullable: true }) draft?: string | null,
  ) {
    return this.agent.improveDraft(user, id, draft);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => String, { description: 'Question libre sur la plateforme.' })
  askAgent(@CurrentUser() user: CurrentUserType, @Args('input') input: AskAgentInput) {
    return this.agent.ask(user, input);
  }
}
