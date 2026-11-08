import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { AssistantService } from './assistant.service';
import { AskAssistantInput, FillFormInput } from './inputs/assistant.inputs';
import {
  AssistantDraftModel,
  AssistantReplyModel,
  AssistantStatusModel,
  DailyBriefingModel,
} from './models/assistant.models';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssistantResolver {
  constructor(private readonly assistantService: AssistantService) {}

  @Query(() => AssistantStatusModel, { description: 'L’assistant IA est-il disponible ?' })
  assistantStatus() {
    return this.assistantService.status();
  }

  @Query(() => DailyBriefingModel, { description: 'Point du jour (avec résumé IA si demandé et disponible)' })
  dailyBriefing(
    @CurrentUser() currentUser: CurrentUserType,
    @Args('withSummary', { type: () => Boolean, nullable: true, defaultValue: false }) withSummary: boolean,
  ) {
    return this.assistantService.dailyBriefing(currentUser, withSummary);
  }

  @Mutation(() => AssistantReplyModel, { description: 'Pose une question à l’assistant (aucune donnée n’est modifiée)' })
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  askAssistant(@CurrentUser() currentUser: CurrentUserType, @Args('input') input: AskAssistantInput) {
    return this.assistantService.ask(currentUser, input);
  }

  @Mutation(() => AssistantDraftModel, { description: 'Pré-remplit un formulaire à partir d’une phrase (rien n’est enregistré)' })
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  fillFormWithAi(@CurrentUser() currentUser: CurrentUserType, @Args('input') input: FillFormInput) {
    return this.assistantService.fill(currentUser, input);
  }
}
