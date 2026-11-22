import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Throttle } from '../common/throttle/throttle.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import type { CompanionQuestion } from '../generated/prisma/client.js';

import type { QuestionOption } from './companion-rules.js';
import {
  AdviceSheetModel,
  CompanionQuestionModel,
  CompanionSettingsModel,
  UpdateCompanionSettingsInput,
} from './companion.models.js';
import { CompanionService } from './companion.service.js';

const toModel = (q: CompanionQuestion): CompanionQuestionModel => ({
  ...q,
  options: (q.options as unknown as QuestionOption[]).map((o) => ({
    value: o.value,
    label: o.label,
    tone: o.tone ?? null,
    href: o.href ?? null,
    adviceKey: o.adviceKey ?? null,
    snooze: !!o.snoozeDays,
  })),
});

/** Assistant « bras droit » de l'éleveur : questions de suivi, alertes, fiches conseils. */
@UseGuards(JwtAuthGuard)
@Resolver()
export class CompanionResolver {
  constructor(private readonly companion: CompanionService) {}

  @Query(() => [CompanionQuestionModel], { description: 'Questions et alertes de l’assistant en attente de réponse.' })
  async companionQuestions(@CurrentUser() user: CurrentUserType) {
    return (await this.companion.pending(user)).map(toModel);
  }

  @Query(() => [CompanionQuestionModel], { description: 'Questions déjà répondues.' })
  async companionHistory(@CurrentUser() user: CurrentUserType) {
    return (await this.companion.history(user)).map(toModel);
  }

  @Query(() => [AdviceSheetModel], { description: 'Fiches conseils de l’assistant.' })
  adviceSheets() {
    return this.companion.adviceSheets();
  }

  @Query(() => CompanionSettingsModel)
  companionSettings(@CurrentUser() user: CurrentUserType) {
    return this.companion.settings(user);
  }

  @Mutation(() => CompanionSettingsModel)
  updateCompanionSettings(@CurrentUser() user: CurrentUserType, @Args('input') input: UpdateCompanionSettingsInput) {
    return this.companion.updateSettings(user, input);
  }

  @Mutation(() => CompanionQuestionModel, { description: 'Répond à une question en un geste.' })
  async answerCompanionQuestion(
    @CurrentUser() user: CurrentUserType,
    @Args('id', { type: () => ID }) id: string,
    @Args('value') value: string,
  ) {
    return toModel(await this.companion.answer(user, id, value));
  }

  @Mutation(() => CompanionQuestionModel)
  async dismissCompanionQuestion(@CurrentUser() user: CurrentUserType, @Args('id', { type: () => ID }) id: string) {
    return toModel(await this.companion.dismiss(user, id));
  }

  @Throttle({ default: { limit: 4, ttl: 60_000 } })
  @Mutation(() => [CompanionQuestionModel], { description: 'L’assistant fait le tour de la ferme maintenant (sans notification).' })
  async companionTourNow(@CurrentUser() user: CurrentUserType) {
    return (await this.companion.tourNow(user)).map(toModel);
  }
}
