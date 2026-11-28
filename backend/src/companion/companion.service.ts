import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { SaleReadinessService } from '../sales/readiness/sale-readiness.service.js';
import { SubscriptionService } from '../subscription/subscription.service.js';
import { platformAdmins } from '../platform/platform.service.js';
import { accessOf } from '../subscription/access.js';
import { computeAutonomy } from '../operations/automation/stock-autonomy.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CompanionQuestionStatus, type CompanionQuestion, type Prisma } from '../generated/prisma/client.js';

import { ADVICE_BY_KEY, ADVICE_SHEETS } from './advice.js';
import {
  DAY,
  HOUR,
  SETUP_GUIDE_DAYS,
  SEVERITY_RANK,
  detectQuestions,
  localDayStart,
  localHour,
  localWeekday,
  weekStart,
  type QuestionOption,
  type Snapshot,
} from './companion-rules.js';
import { geocode, maxTemperatures } from './weather.js';
import { SetupService } from '../setup/setup.service.js';
import { setupProgress } from '../setup/setup-steps.js';
import type { UpdateCompanionSettingsInput } from './companion.models.js';

const PENDING = CompanionQuestionStatus.PENDING;
const bySeverity = (a: CompanionQuestion, b: CompanionQuestion) =>
  (SEVERITY_RANK[a.severity] ?? 3) - (SEVERITY_RANK[b.severity] ?? 3) || a.askAt.getTime() - b.askAt.getTime();

/** Pas de notification la nuit (heure de Douala). */
const QUIET_FROM = 21;
const QUIET_UNTIL = 6;

@Injectable()
export class CompanionService {
  private readonly logger = new Logger('Assistant bras droit');

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly readiness: SaleReadinessService,
    private readonly subscriptions: SubscriptionService,
    private readonly setup: SetupService,
  ) {}

  // ---------------------------------------------------------------
  // Tournée (6 h, 13 h, 18 h)
  // ---------------------------------------------------------------

  /** Fait le tour de chaque ferme active : nouvelles questions, puis une notification par ferme au plus. */
  async tour(options: { now?: Date; farmId?: string; notify?: boolean } = {}) {
    const now = options.now ?? new Date();
    const notify = options.notify ?? true;
    const settings = await this.subscriptions.settings();
    const admins = platformAdmins();
    const farms = await this.prisma.farm.findMany({
      where: { companionEnabled: true, ...(options.farmId ? { id: options.farmId } : {}) },
      select: {
        id: true, location: true, latitude: true, longitude: true, geocodedLocation: true, companionMaxPerDay: true,
        createdAt: true, trialEndsAt: true, paidUntil: true, freeAccess: true,
        memberships: { select: { user: { select: { email: true } } } },
      },
    });

    const weatherCache = new Map<string, Snapshot['heat']>();
    let created = 0;
    let notified = 0;
    for (const farm of farms) {
      const exempt = farm.freeAccess || farm.memberships.some((m) => admins.includes(m.user.email.toLowerCase()));
      if (accessOf(farm, settings.trialDays, exempt, now).status === 'EXPIRED') continue;
      try {
        const heat = await this.heatFor(farm, weatherCache);
        const snapshot = await this.snapshot(farm.id, now, heat, farm.createdAt);
        const specs = detectQuestions(snapshot);
        await this.closeSetupQuestions(farm.id, snapshot.setup?.next?.key ?? null);
        if (specs.length === 0) continue;
        created += await this.store(farm.id, specs);
        if (notify && (await this.notifyFarm(farm.id, farm.companionMaxPerDay, now))) notified += 1;
      } catch (e) {
        this.logger.warn(`Tournée impossible pour la ferme ${farm.id} : ${String(e).slice(0, 200)}`);
      }
    }
    await this.prisma.companionQuestion.updateMany({
      where: { status: PENDING, expiresAt: { lt: now } },
      data: { status: CompanionQuestionStatus.EXPIRED },
    });
    return { farms: farms.length, created, notified };
  }

  /** Une étape de démarrage faite entre-temps : sa question n'a plus lieu d'être. */
  private async closeSetupQuestions(farmId: string, currentStep: string | null) {
    await this.prisma.companionQuestion.updateMany({
      where: {
        farmId,
        kind: 'SETUP',
        status: PENDING,
        ...(currentStep ? { NOT: { key: { startsWith: `SETUP:${currentStep}:` } } } : {}),
      },
      data: { status: CompanionQuestionStatus.EXPIRED },
    });
  }

  private async store(farmId: string, specs: ReturnType<typeof detectQuestions>) {
    if (specs.length === 0) return 0;
    const result = await this.prisma.companionQuestion.createMany({
      data: specs.map((q) => ({
        farmId,
        key: q.key,
        kind: q.kind,
        severity: q.severity,
        title: q.title,
        detail: q.detail ?? null,
        rabbitId: q.rabbitId ?? null,
        refId: q.refId ?? null,
        options: q.options as unknown as Prisma.InputJsonValue,
        adviceKey: q.adviceKey ?? null,
        href: q.href ?? null,
        askAt: q.askAt,
        expiresAt: q.expiresAt,
      })),
      skipDuplicates: true,
    });
    return result.count;
  }

  /** Une notification qui regroupe les questions arrivées, dans la limite choisie par l'éleveur. */
  private async notifyFarm(farmId: string, maxPerDay: number, now: Date) {
    const hour = localHour(now);
    if (hour >= QUIET_FROM || hour < QUIET_UNTIL) return false;
    const due = await this.prisma.companionQuestion.findMany({
      where: { farmId, status: PENDING, askAt: { lte: now }, notifiedAt: null },
    });
    if (due.length === 0) return false;
    due.sort(bySeverity);
    const urgent = due[0].severity === 'danger';
    const sentToday = await this.prisma.companionQuestion.groupBy({
      by: ['notifiedAt'],
      where: { farmId, notifiedAt: { gte: localDayStart(now) } },
    });
    if (!urgent && sentToday.length >= maxPerDay) return false;

    const others = due.length - 1;
    const sent = await this.notifications.sendToFarm(farmId, {
      title: urgent ? 'RabbitFarm : alerte de ton assistant' : 'RabbitFarm : ton assistant a une question',
      body: `${due[0].title}${others > 0 ? ` (+${others} autre${others > 1 ? 's' : ''})` : ''}`.slice(0, 200),
      url: '/questions',
      tag: 'rabbitfarm-assistant',
    });
    // Rien n'a atteint de téléphone (aucun appareil abonné, clés absentes…) : on réessaiera à la tournée suivante.
    if (sent === 0) return false;
    await this.prisma.companionQuestion.updateMany({ where: { id: { in: due.map((q) => q.id) } }, data: { notifiedAt: now } });
    return true;
  }

  private async heatFor(
    farm: { id: string; location: string | null; latitude: number | null; longitude: number | null; geocodedLocation: string | null },
    cache: Map<string, Snapshot['heat']>,
  ): Promise<Snapshot['heat']> {
    let { latitude, longitude } = farm;
    const location = farm.location?.trim() ?? '';
    if (location && (latitude == null || longitude == null || farm.geocodedLocation !== location)) {
      const found = await geocode(location);
      if (found) {
        ({ latitude, longitude } = found);
        await this.prisma.farm.update({ where: { id: farm.id }, data: { latitude, longitude, geocodedLocation: location } });
      }
    }
    if (latitude == null || longitude == null) return null;
    const key = `${latitude.toFixed(1)},${longitude.toFixed(1)}`;
    if (!cache.has(key)) cache.set(key, await maxTemperatures(latitude, longitude));
    return cache.get(key) ?? null;
  }

  // ---------------------------------------------------------------
  // Instantané de la ferme
  // ---------------------------------------------------------------

  async snapshot(farmId: string, now: Date, heat: Snapshot['heat'], farmCreatedAt?: Date): Promise<Snapshot> {
    const since = (days: number) => new Date(now.getTime() - days * DAY);
    const today = localDayStart(now);
    const tomorrow = new Date(today.getTime() + DAY);
    const isSunday = localWeekday(now) === 0;
    const monday = weekStart(now);

    const [
      health, cares, dueHealth, dueCares, breedings, births, litters, deaths, lots, feed,
      recentBreedings, matingsToday, readyCount, rabbitsActive, activity, week,
    ] = await Promise.all([
      this.prisma.healthRecord.findMany({
        where: { farmId, type: 'TREATMENT', createdAt: { gte: since(2) } },
        select: { id: true, rabbitId: true, medication: true, treatment: true, createdAt: true, rabbit: { select: { code: true } } },
      }),
      this.prisma.careRecord.findMany({
        where: { farmId, scope: { in: ['RABBIT', 'LOT', 'CAGE'] }, createdAt: { gte: since(2) } },
        select: {
          id: true, careType: true, product: true, scope: true, rabbitId: true, createdAt: true,
          rabbit: { select: { code: true } }, lot: { select: { code: true } }, cage: { select: { code: true } },
        },
      }),
      this.prisma.healthRecord.findMany({
        where: { farmId, nextDueDate: { gte: today, lt: tomorrow } },
        select: { id: true, rabbitId: true, type: true, medication: true, treatment: true, nextDueDate: true, rabbit: { select: { code: true } } },
      }),
      this.prisma.careRecord.findMany({
        where: { farmId, nextDate: { gte: today, lt: tomorrow } },
        select: {
          id: true, careType: true, scope: true, rabbitId: true, nextDate: true,
          rabbit: { select: { code: true } }, lot: { select: { code: true } }, cage: { select: { code: true } },
        },
      }),
      this.prisma.breeding.findMany({
        where: { farmId, breedingDate: { gte: since(35) }, status: { not: 'CANCELLED' } },
        select: {
          id: true, femaleId: true, breedingDate: true, status: true,
          female: { select: { code: true } }, nestInstallation: { select: { id: true } }, birth: { select: { id: true } },
        },
      }),
      this.prisma.birth.findMany({
        where: { farmId, createdAt: { gte: since(3) } },
        select: { id: true, motherId: true, liveBorn: true, createdAt: true, mother: { select: { code: true } } },
      }),
      this.prisma.litter.findMany({
        where: { farmId, status: 'ACTIVE', birthDate: { gte: since(10) } },
        select: { id: true, motherId: true, birthDate: true, currentCount: true, mother: { select: { code: true } } },
      }),
      this.prisma.mortalityRecord.findMany({
        where: { farmId, OR: [{ date: { gte: since(8) } }, { createdAt: { gte: since(3) } }] },
        select: {
          id: true, date: true, createdAt: true, count: true, cause: true, scope: true,
          rabbit: { select: { code: true } }, litter: { select: { code: true } }, lot: { select: { code: true } },
        },
      }),
      this.prisma.fatteningLot.findMany({
        where: { farmId, status: 'ACTIVE' },
        select: { id: true, code: true, weighings: { orderBy: { date: 'desc' }, take: 2, select: { date: true, averageWeight: true, totalWeight: true, animalCount: true } } },
      }),
      this.prisma.inventoryItem.findMany({
        where: { farmId, type: 'FEED' },
        select: { id: true, name: true, unit: true, currentStock: true, minimumStock: true, movements: { where: { type: 'CONSUMPTION', date: { gte: since(30) } }, select: { type: true, quantity: true, date: true } } },
      }),
      this.prisma.breeding.findMany({
        where: { farmId, breedingDate: { gte: since(240) }, female: { status: 'ACTIVE' } },
        orderBy: { breedingDate: 'desc' },
        select: { femaleId: true, status: true, female: { select: { code: true } } },
      }),
      Promise.all([
        this.prisma.breeding.findMany({ where: { farmId, breedingDate: { gte: today, lt: tomorrow } }, select: { maleId: true, male: { select: { code: true } } } }),
        this.prisma.breedingMating.findMany({ where: { breeding: { farmId }, date: { gte: today, lt: tomorrow } }, select: { maleId: true, male: { select: { code: true } } } }),
      ]),
      this.readiness.readyCount(farmId).catch(() => 0),
      this.prisma.rabbit.count({ where: { farmId, status: 'ACTIVE' } }),
      this.lastActivity(farmId),
      isSunday ? this.weekFigures(farmId, monday, now) : Promise.resolve(null),
    ]);

    const scopeTarget = (c: { scope: string; rabbit: { code: string } | null; lot: { code: string } | null; cage: { code: string } | null }) =>
      c.rabbit?.code ?? (c.lot ? `le lot ${c.lot.code}` : c.cage ? `la cage ${c.cage.code}` : 'la ferme');

    // Femelles : saillies ratées à la suite (les plus récentes d'abord).
    const misses = new Map<string, { code: string; misses: number; open: boolean }>();
    for (const b of recentBreedings) {
      const entry = misses.get(b.femaleId) ?? { code: b.female.code, misses: 0, open: true };
      if (entry.open) {
        if (b.status === 'NON_PREGNANT') entry.misses += 1;
        else if (b.status !== 'PLANNED' && b.status !== 'AWAITING_PALPATION') entry.open = false;
      }
      misses.set(b.femaleId, entry);
    }

    const males = new Map<string, { code: string; matings: number }>();
    for (const m of [...matingsToday[0], ...matingsToday[1]]) {
      const entry = males.get(m.maleId) ?? { code: m.male.code, matings: 0 };
      entry.matings += 1;
      males.set(m.maleId, entry);
    }

    return {
      now,
      treatments: [
        ...health.map((h) => ({
          id: h.id, rabbitId: h.rabbitId, target: h.rabbit.code, createdAt: h.createdAt,
          label: h.medication || h.treatment ? `un traitement (${(h.medication || h.treatment)?.slice(0, 40)})` : 'un traitement',
        })),
        ...cares.map((c) => ({
          id: c.id, rabbitId: c.rabbitId, target: scopeTarget(c), createdAt: c.createdAt,
          label: `un soin (${c.careType.toLowerCase()}${c.product ? `, ${c.product}` : ''})`.slice(0, 60),
        })),
      ],
      dueReminders: [
        ...dueHealth.map((h) => ({
          id: h.id, source: 'HEALTH' as const, rabbitId: h.rabbitId, target: h.rabbit.code, dueDate: h.nextDueDate as Date,
          label: h.type === 'VACCINATION' ? 'le rappel de vaccin' : `le suivi (${(h.medication || h.treatment || 'santé').slice(0, 40)})`,
        })),
        ...dueCares.map((c) => ({
          id: c.id, source: 'CARE' as const, rabbitId: c.rabbitId, target: scopeTarget(c), dueDate: c.nextDate as Date,
          label: c.careType.toLowerCase(),
        })),
      ],
      breedings: breedings.map((b) => ({
        id: b.id, femaleId: b.femaleId, femaleCode: b.female.code, breedingDate: b.breedingDate, status: b.status,
        hasNest: !!b.nestInstallation, hasBirth: !!b.birth,
      })),
      births: births.map((b) => ({ id: b.id, motherId: b.motherId, motherCode: b.mother.code, liveBorn: b.liveBorn, createdAt: b.createdAt })),
      litters: litters.map((l) => ({ id: l.id, motherId: l.motherId, motherCode: l.mother.code, birthDate: l.birthDate, currentCount: l.currentCount })),
      deaths: deaths.map((d) => ({
        id: d.id, date: d.date, createdAt: d.createdAt, count: d.count, cause: d.cause,
        label: d.rabbit?.code ?? (d.litter ? `portée ${d.litter.code}` : d.lot ? `lot ${d.lot.code}` : 'un lapin'),
      })),
      lots: lots.map((l) => ({
        id: l.id,
        code: l.code,
        weighings: l.weighings
          .map((w) => ({ date: w.date, averageWeight: w.averageWeight ?? (w.animalCount > 0 ? w.totalWeight / w.animalCount : 0) }))
          .filter((w) => w.averageWeight > 0)
          .reverse(),
      })),
      feed: feed.map((f) => ({
        id: f.id, name: f.name, unit: f.unit, currentStock: f.currentStock, minimumStock: f.minimumStock,
        dailyUse: computeAutonomy(f.currentStock, f.movements, now).averageDailyConsumption,
      })),
      femalesFailed: [...misses.entries()].filter(([, v]) => v.misses >= 3).map(([id, v]) => ({ id, code: v.code, misses: v.misses })),
      malesToday: [...males.entries()].map(([id, v]) => ({ id, ...v })),
      readyCount,
      rabbitsActive,
      lastActivityAt: activity,
      heat,
      week,
      setup: await this.setupFor(farmId, now, farmCreatedAt),
    };
  }

  private async setupFor(farmId: string, now: Date, createdAt?: Date): Promise<Snapshot['setup']> {
    if (!createdAt) return null;
    const farmAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / DAY);
    if (farmAgeDays > SETUP_GUIDE_DAYS) return null;
    const { next } = setupProgress(await this.setup.counts(farmId));
    return {
      farmAgeDays,
      next: next ? { key: next.key, title: next.title, detail: next.detail, href: next.href, altLabel: next.altLabel, altHref: next.altHref } : null,
    };
  }

  /** Dernière saisie de la ferme, toutes activités confondues. */
  private async lastActivity(farmId: string) {
    const latest = await Promise.all([
      this.prisma.healthRecord.findFirst({ where: { farmId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.careRecord.findFirst({ where: { farmId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.breeding.findFirst({ where: { farmId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.birth.findFirst({ where: { farmId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.mortalityRecord.findFirst({ where: { farmId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.task.findFirst({ where: { farmId, completedAt: { not: null } }, orderBy: { completedAt: 'desc' }, select: { completedAt: true } }),
      this.prisma.sale.findFirst({ where: { farmId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.rabbit.findFirst({ where: { farmId }, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
    ]);
    const times = latest
      .map((r) => (r ? ('createdAt' in r ? r.createdAt : 'completedAt' in r ? r.completedAt : 'updatedAt' in r ? r.updatedAt : null) : null))
      .filter((d): d is Date => d instanceof Date)
      .map((d) => d.getTime());
    return times.length ? new Date(Math.max(...times)) : null;
  }

  private async weekFigures(farmId: string, from: Date, to: Date) {
    const [births, deaths, sales, expenses] = await Promise.all([
      this.prisma.birth.aggregate({ where: { farmId, birthDate: { gte: from, lte: to } }, _sum: { liveBorn: true } }),
      this.prisma.mortalityRecord.aggregate({ where: { farmId, date: { gte: from, lte: to } }, _sum: { count: true } }),
      this.prisma.sale.aggregate({ where: { farmId, saleDate: { gte: from, lte: to }, status: { not: 'CANCELLED' } }, _count: { _all: true }, _sum: { totalAmount: true } }),
      this.prisma.expense.aggregate({ where: { farmId, date: { gte: from, lte: to } }, _sum: { amount: true } }),
    ]);
    return {
      births: births._sum.liveBorn ?? 0,
      deaths: deaths._sum.count ?? 0,
      sales: sales._count._all,
      salesAmount: Number(sales._sum.totalAmount ?? 0),
      expenses: Number(expenses._sum.amount ?? 0),
    };
  }

  // ---------------------------------------------------------------
  // Côté éleveur
  // ---------------------------------------------------------------

  async pending(user: CurrentUserType, now = new Date()) {
    const rows = await this.prisma.companionQuestion.findMany({
      where: { farmId: user.farmId, status: PENDING, askAt: { lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
      take: 30,
    });
    return rows.sort(bySeverity);
  }

  history(user: CurrentUserType) {
    return this.prisma.companionQuestion.findMany({
      where: { farmId: user.farmId, status: { in: [CompanionQuestionStatus.ANSWERED, CompanionQuestionStatus.DISMISSED] } },
      orderBy: { answeredAt: 'desc' },
      take: 40,
    });
  }

  private async own(user: CurrentUserType, id: string) {
    const q = await this.prisma.companionQuestion.findFirst({ where: { id, farmId: user.farmId } });
    if (!q || q.status !== PENDING) throw new NotFoundException('Question introuvable ou déjà traitée.');
    return q;
  }

  /** Réponse en un geste : peut reporter la question, ouvrir une fiche santé et une tâche, ou noter la cause d'une mort. */
  async answer(user: CurrentUserType, id: string, value: string, now = new Date()) {
    const q = await this.own(user, id);
    const option = (q.options as unknown as QuestionOption[]).find((o) => o.value === value);
    if (!option) throw new BadRequestException('Réponse inconnue pour cette question.');

    if (option.snoozeDays) {
      const askAt = new Date(now.getTime() + option.snoozeDays * DAY);
      return this.prisma.companionQuestion.update({
        where: { id },
        data: { askAt, notifiedAt: null, expiresAt: q.expiresAt && q.expiresAt < askAt ? new Date(askAt.getTime() + DAY) : q.expiresAt },
      });
    }

    if (option.effect === 'OBSERVE_BAD') await this.observeBad(user, q, option, now);
    if (option.effect === 'SET_CAUSE' && q.refId) {
      await this.prisma.mortalityRecord.updateMany({ where: { id: q.refId, farmId: user.farmId, cause: null }, data: { cause: option.value } });
    }

    return this.prisma.companionQuestion.update({
      where: { id },
      data: {
        status: CompanionQuestionStatus.ANSWERED,
        answer: option.value,
        answerLabel: option.label,
        answeredById: user.userId,
        answeredAt: now,
        adviceKey: option.adviceKey ?? q.adviceKey,
        href: option.href ?? q.href,
      },
    });
  }

  /** « Il va mal » : une observation dans sa fiche santé et une tâche de contrôle pour demain matin. */
  private async observeBad(user: CurrentUserType, q: CompanionQuestion, option: QuestionOption, now: Date) {
    const rabbit = q.rabbitId
      ? await this.prisma.rabbit.findFirst({ where: { id: q.rabbitId, farmId: user.farmId }, select: { id: true, code: true } })
      : null;
    const note = `Signalé à l’assistant : « ${q.title} » → ${option.label}.`;
    if (rabbit) {
      await this.prisma.healthRecord.create({
        data: { farmId: user.farmId, rabbitId: rabbit.id, type: 'OBSERVATION', date: now, observation: note, createdById: user.userId },
      });
    }
    await this.prisma.task.create({
      data: {
        farmId: user.farmId,
        title: rabbit ? `Contrôler ${rabbit.code}` : 'Contrôle demandé par l’assistant',
        description: `${note} Regarde s’il mange, boit, et appelle le vétérinaire si ça ne s’améliore pas.`,
        rabbitId: rabbit?.id ?? null,
        dueDate: new Date(localDayStart(now).getTime() + DAY + 7 * HOUR),
        priority: 'HIGH',
        sourceType: 'HEALTH',
        sourceId: q.id,
        automationKey: 'COMPANION_CHECK',
      },
    });
  }

  async dismiss(user: CurrentUserType, id: string, now = new Date()) {
    await this.own(user, id);
    return this.prisma.companionQuestion.update({
      where: { id },
      data: { status: CompanionQuestionStatus.DISMISSED, answeredById: user.userId, answeredAt: now },
    });
  }

  async settings(user: CurrentUserType) {
    const farm = await this.prisma.farm.findUniqueOrThrow({
      where: { id: user.farmId },
      select: { companionEnabled: true, companionMaxPerDay: true, location: true, latitude: true },
    });
    return { enabled: farm.companionEnabled, maxPerDay: farm.companionMaxPerDay, location: farm.location, weatherReady: farm.latitude != null };
  }

  async updateSettings(user: CurrentUserType, input: UpdateCompanionSettingsInput) {
    const location = input.location?.trim();
    await this.prisma.farm.update({
      where: { id: user.farmId },
      data: {
        ...(input.enabled != null ? { companionEnabled: input.enabled } : {}),
        ...(input.maxPerDay != null ? { companionMaxPerDay: input.maxPerDay } : {}),
        ...(location !== undefined ? { location: location || null, latitude: null, longitude: null, geocodedLocation: null } : {}),
      },
    });
    return this.settings(user);
  }

  adviceSheets() {
    return ADVICE_SHEETS;
  }

  advice(key: string) {
    return ADVICE_BY_KEY.get(key) ?? null;
  }

  /** Bouton « Demander à l'assistant de faire le tour maintenant » (sans notification). */
  async tourNow(user: CurrentUserType) {
    await this.tour({ farmId: user.farmId, notify: false });
    return this.pending(user);
  }
}
