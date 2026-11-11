import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Optional,
  ServiceUnavailableException,
} from '@nestjs/common';
import { generateText, Output, stepCountIs, type LanguageModel, type ModelMessage } from 'ai';

import { BreedingStatus, TaskStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';

import type { AiConfig } from './ai-config';
import { describeAiError, isOverloaded } from './ai-error';
import { FORM_LABELS, FORM_SCHEMAS, prepareForm, type AssistantForm, type PreparedForm } from './assistant-forms';
import { buildAssistantTools } from './assistant-tools';
import { buildBriefing, type BriefingItem } from './briefing';
import { FarmReader } from './farm-reader';
import type { AskAssistantInput, FillFormInput } from './inputs/assistant.inputs';

export const ASSISTANT_MODEL = Symbol('ASSISTANT_MODEL');
export const ASSISTANT_CONFIG = Symbol('ASSISTANT_CONFIG');
export const ASSISTANT_FALLBACK_MODEL = Symbol('ASSISTANT_FALLBACK_MODEL');

const DAY = 86_400_000;
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

const BASE_RULES = `Tu es l'assistant de RabbitFarm, une application de gestion d'élevage de lapins utilisée en Afrique francophone.
Règles :
- Réponds en français simple, en phrases courtes. Monnaie : FCFA.
- Pour toute donnée de la ferme, appelle d'abord les outils « lire… ». N'invente jamais un chiffre, un code ou une date.
- Traduis les codes techniques en français (FEMALE = femelle, PREGNANT = gestante, AWAITING_PALPATION = en attente de palpation, ACTIVE = actif, etc.).
- Quand l'éleveur veut enregistrer quelque chose (saillie, palpation, mise bas, soin, dépense, tâche, mort / réforme / transfert d'un lapin), utilise l'outil « preparer… » correspondant. Tu ne peux rien enregistrer toi-même : dis-lui de vérifier puis valider le brouillon avec le bouton qui s'affiche.
- Santé : donne des pistes et des gestes de prudence (isoler, eau propre, hygiène), jamais un diagnostic certain ; conseille le vétérinaire en cas de doute ou de mortalité.
- Repères d'élevage : gestation ≈ 31 jours, palpation vers J+10 à J+14, nid vers J+28, sevrage vers 35 jours.
- Les ventes se saisissent dans la page Ventes : guide l'éleveur sans préparer de brouillon.
- Si l'information manque, dis-le et propose ce que l'éleveur peut noter.`;

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private readonly summaries = new Map<string, { at: number; summary: string }>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(ASSISTANT_MODEL) private readonly model: LanguageModel | null,
    @Inject(ASSISTANT_CONFIG) private readonly config: AiConfig,
    @Optional() @Inject(ASSISTANT_FALLBACK_MODEL) private readonly fallback: LanguageModel | null = null,
  ) {}

  status() {
    return {
      enabled: this.model !== null,
      provider: this.config.provider,
      model: this.config.model,
    };
  }

  // ---------------------------------------------------------------
  // Discussion
  // ---------------------------------------------------------------

  async ask(user: CurrentUserType, input: AskAssistantInput) {
    await this.requireModel(user);
    const now = new Date();
    const reader = new FarmReader(this.prisma, user.farmId, now);
    const drafts: PreparedForm[] = [];

    const messages: ModelMessage[] = [
      ...(input.history ?? []).slice(-20).map(
        (message): ModelMessage =>
          message.role === 'assistant'
            ? { role: 'assistant', content: message.content }
            : { role: 'user', content: message.content },
      ),
      { role: 'user', content: input.message },
    ];

    const result = await this.call((model) => {
      drafts.length = 0; // un nouvel essai repart sans les brouillons du précédent
      return generateText({
        model,
        system: `${BASE_RULES}\nAujourd'hui : ${isoDay(now)}.${input.page ? `\nL'éleveur est sur la page : ${input.page}.` : ''}`,
        messages,
        tools: buildAssistantTools(reader, drafts),
        stopWhen: stepCountIs(8),
        maxOutputTokens: 1200,
        ...this.limits(),
      });
    });

    return {
      text: result.text.trim() || (drafts.length ? 'Voici le brouillon à vérifier.' : 'Je n’ai pas de réponse pour le moment.'),
      drafts: drafts.map(toDraftModel),
    };
  }

  // ---------------------------------------------------------------
  // Remplissage d'un formulaire à partir d'une phrase
  // ---------------------------------------------------------------

  async fill(user: CurrentUserType, input: FillFormInput) {
    await this.requireModel(user);
    const form = input.form as AssistantForm;
    const now = new Date();

    const result = await this.call((model) =>
      generateText({
        model,
        system: `Tu extrais les informations d'une phrase d'éleveur de lapins pour remplir le formulaire « ${FORM_LABELS[form]} ».
Ne remplis que ce qui est dit ou déduit sans ambiguïté. Dates au format AAAA-MM-JJ ; « aujourd'hui » = ${isoDay(now)}, « hier » = ${isoDay(new Date(now.getTime() - DAY))}.
Si l'éleveur donne un total et des morts (« 8 dont 1 mort »), les vivants sont la différence.`,
        prompt: `${input.context ? `Contexte déjà connu : ${input.context}\n` : ''}Phrase de l'éleveur : ${input.text}`,
        output: Output.object({ schema: FORM_SCHEMAS[form] }),
        maxOutputTokens: 600,
        ...this.limits(),
      }),
    );

    const prepared = await prepareForm(form, (result.output ?? {}) as Record<string, unknown>, new FarmReader(this.prisma, user.farmId, now));
    return toDraftModel(prepared);
  }

  // ---------------------------------------------------------------
  // Point du jour
  // ---------------------------------------------------------------

  async dailyBriefing(user: CurrentUserType, withSummary = false) {
    const now = new Date();
    const items = await this.computeBriefing(user.farmId, now);
    const date = isoDay(now);

    let summary: string | null = null;
    if (withSummary && this.model && items.length > 0) {
      summary = await this.briefingSummary(user, items, date).catch((error: unknown) => {
        this.logger.warn(`Résumé du point du jour indisponible : ${String(error)}`);
        return null;
      });
    }

    return { date, items, summary };
  }

  private async computeBriefing(farmId: string, now: Date): Promise<BriefingItem[]> {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + DAY);
    const open = { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] };

    const [overdueTasks, todayTasks, birthsExpectedSoon, last7, previous7, stock] = await Promise.all([
      this.prisma.task.count({ where: { farmId, status: open, dueDate: { lt: start } } }),
      this.prisma.task.findMany({
        where: { farmId, status: open, dueDate: { gte: start, lt: end } },
        select: { automationKey: true },
      }),
      this.prisma.breeding.count({
        where: {
          farmId,
          status: { in: [BreedingStatus.PREGNANT, BreedingStatus.AWAITING_PALPATION, BreedingStatus.INCONCLUSIVE] },
          expectedBirthStartDate: { gte: start, lt: new Date(start.getTime() + 4 * DAY) },
        },
      }),
      this.prisma.mortalityRecord.aggregate({
        where: { farmId, date: { gte: new Date(now.getTime() - 7 * DAY) } },
        _sum: { count: true },
      }),
      this.prisma.mortalityRecord.aggregate({
        where: { farmId, date: { gte: new Date(now.getTime() - 14 * DAY), lt: new Date(now.getTime() - 7 * DAY) } },
        _sum: { count: true },
      }),
      this.prisma.inventoryItem.findMany({
        where: { farmId, minimumStock: { not: null } },
        select: { currentStock: true, minimumStock: true },
      }),
    ]);

    const dueTodayByKey: Record<string, number> = {};
    let otherTasksToday = 0;
    for (const task of todayTasks) {
      if (task.automationKey) dueTodayByKey[task.automationKey] = (dueTodayByKey[task.automationKey] ?? 0) + 1;
      else otherTasksToday += 1;
    }

    return buildBriefing({
      overdueTasks,
      dueTodayByKey,
      otherTasksToday,
      birthsExpectedSoon,
      deathsLast7Days: last7._sum.count ?? 0,
      deathsPrevious7Days: previous7._sum.count ?? 0,
      lowStockItems: stock.filter((item) => item.minimumStock !== null && item.currentStock <= item.minimumStock).length,
    });
  }

  private async briefingSummary(user: CurrentUserType, items: BriefingItem[], date: string) {
    const cacheKey = `${user.farmId}:${date}:${items.map((item) => `${item.key}=${item.count}`).join(',')}`;
    const cached = this.summaries.get(cacheKey);
    if (cached && Date.now() - cached.at < 3 * 3600_000) return cached.summary;

    await this.requireModel(user);
    const result = await this.call((model) =>
      generateText({
        model,
        system: `${BASE_RULES}\nAujourd'hui : ${date}.`,
        prompt: `Voici le point du jour calculé par l'application :\n${items.map((item) => `- ${item.label}`).join('\n')}\n\nÉcris en 2 ou 3 phrases ce que l'éleveur doit faire en priorité aujourd'hui, dans l'ordre. Pas de liste, pas de titre.`,
        maxOutputTokens: 300,
        ...this.limits(),
      }),
    );
    const summary = result.text.trim();
    this.summaries.set(cacheKey, { at: Date.now(), summary });
    return summary;
  }

  // ---------------------------------------------------------------
  // Garde-fous
  // ---------------------------------------------------------------

  /**
   * Vérifie que l'assistant est configuré et compte la demande.
   * Le compteur est en base : il reste juste même quand l'API tourne
   * sur plusieurs instances (Vercel) ou redémarre.
   */
  private async requireModel(user: CurrentUserType): Promise<LanguageModel> {
    if (!this.model) {
      throw new ServiceUnavailableException(
        "L'assistant IA n'est pas configuré (clé API manquante côté serveur).",
      );
    }
    const day = isoDay(new Date());
    const usage = await this.prisma.aiUsage.upsert({
      where: { farmId_day: { farmId: user.farmId, day } },
      create: { farmId: user.farmId, day, count: 1 },
      update: { count: { increment: 1 } },
    });
    if (usage.count > this.config.dailyLimit) {
      throw new HttpException(
        `Limite quotidienne de l'assistant atteinte (${this.config.dailyLimit} demandes). Réessaie demain.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return this.model;
  }

  /** Délai maximum et nombre de nouvelles tentatives de chaque appel. */
  private limits() {
    return { timeout: { totalMs: this.config.timeoutMs }, maxRetries: 1 };
  }

  /**
   * Lance l'appel avec le modèle principal, puis avec le modèle de secours
   * si le premier est saturé (429 ou 5xx).
   */
  private async call<T>(run: (model: LanguageModel) => Promise<T>): Promise<T> {
    const started = Date.now();
    try {
      try {
        return await run(this.model as LanguageModel);
      } catch (error) {
        if (!this.fallback || !isOverloaded(error)) throw error;
        this.logger.warn(`Modèle ${this.config.model} saturé, essai avec ${this.config.fallbackModel}.`);
        return await run(this.fallback);
      }
    } catch (error) {
      const message = describeAiError(error, this.config.provider);
      this.logger.error(
        `Appel IA en échec après ${Math.round((Date.now() - started) / 1000)} s : ${error instanceof Error ? error.message : String(error)} → ${message}`,
      );
      throw new ServiceUnavailableException(message);
    }
  }
}

export function toDraftModel(prepared: PreparedForm) {
  return {
    form: prepared.form,
    summary: prepared.summary,
    fields: JSON.stringify(prepared.fields),
    warnings: prepared.warnings,
    href: prepared.href,
  };
}

