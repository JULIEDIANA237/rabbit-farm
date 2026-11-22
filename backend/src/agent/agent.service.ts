import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
import { generateText, type LanguageModel, type ModelMessage } from 'ai';

import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PlatformService, platformAdmins } from '../platform/platform.service.js';
import { SubscriptionService } from '../subscription/subscription.service.js';
import { accessOf } from '../subscription/access.js';
import { frontendUrl } from '../auth/password-reset/password-reset.service.js';
import { speedOptions, type AiConfig } from '../assistant/ai-config.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { AgentSuggestionStatus, type AgentSuggestion } from '../generated/prisma/client.js';

import { DAY, THRESHOLDS, detect, plainBrief, type AgentFacts, type Finding } from './agent-rules.js';
import type { AskAgentInput } from './agent.models.js';

export const AGENT_MODEL = Symbol('AGENT_MODEL');
export const AGENT_FALLBACK_MODEL = Symbol('AGENT_FALLBACK_MODEL');
export const AGENT_CONFIG = Symbol('AGENT_CONFIG');

const RANK: Record<string, number> = { danger: 0, warning: 1, info: 2 };
const bySeverity = (a: AgentSuggestion, b: AgentSuggestion) =>
  (RANK[a.severity] ?? 3) - (RANK[b.severity] ?? 3) || a.createdAt.getTime() - b.createdAt.getTime();

const BRIEF_RULES = `Tu es l'assistant de Diana, propriétaire de l'application RabbitFarm (gestion d'élevages de lapins, Cameroun, prix en FCFA).
Tu rédiges son point du matin en français, en la tutoyant : 3 à 6 lignes courtes, une idée par ligne, la plus urgente d'abord.
Utilise uniquement les faits fournis : n'invente aucun chiffre, aucun nom, aucune cause. Pas de titre, pas de liste à puces, pas d'emoji.
S'il n'y a rien d'urgent, dis-le en une phrase et donne le chiffre le plus utile du jour.`;

const ASK_RULES = `Tu es l'assistant de Diana, propriétaire de l'application RabbitFarm (gestion d'élevages de lapins, Cameroun, prix en FCFA).
Tu réponds à ses questions sur la plateforme, en français, en la tutoyant, brièvement et avec des chiffres.
Tu ne disposes que des données ci-dessous : si la réponse n'y est pas, dis-le simplement. N'invente rien.
Tu ne peux rien modifier : pour agir (confirmer un paiement, relancer un éleveur…), indique l'onglet de son espace propriétaire où le faire.`;

@Injectable()
export class AgentService {
  private readonly logger = new Logger('Agent propriétaire');

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptions: SubscriptionService,
    private readonly platform: PlatformService,
    private readonly mail: MailService,
    private readonly notifications: NotificationsService,
    @Inject(AGENT_CONFIG) private readonly config: AiConfig,
    @Inject(AGENT_MODEL) private readonly model: LanguageModel | null,
    @Optional() @Inject(AGENT_FALLBACK_MODEL) private readonly fallback: LanguageModel | null = null,
  ) {}

  private assertAdmin(user: CurrentUserType) {
    if (!this.platform.isAdmin(user)) throw new ForbiddenException('Réservé à la propriétaire de l’application.');
  }

  // ---------------------------------------------------------------
  // Faits de la plateforme
  // ---------------------------------------------------------------

  async collectFacts(now = new Date()): Promise<AgentFacts> {
    const admins = platformAdmins();
    const since24h = new Date(now.getTime() - DAY);
    const [settings, payments, farms, rabbitCounts, newUsers24h, newFarms24h, contacts, lowRatings, errors24h, lastError, dbSizeMb, totalUsers] =
      await Promise.all([
        this.subscriptions.settings(),
        this.prisma.subscriptionPayment.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' }, include: { farm: { select: { name: true } } } }),
        this.prisma.farm.findMany({
          select: {
            id: true, name: true, createdAt: true, trialEndsAt: true, paidUntil: true, freeAccess: true,
            memberships: { orderBy: { createdAt: 'asc' }, select: { role: true, user: { select: { email: true, firstName: true, lastSeenAt: true } } } },
          },
        }),
        this.prisma.rabbit.groupBy({ by: ['farmId'], where: { status: 'ACTIVE' }, _count: { _all: true } }),
        this.prisma.user.count({ where: { createdAt: { gte: since24h } } }),
        this.prisma.farm.count({ where: { createdAt: { gte: since24h } } }),
        this.prisma.contactMessage.findMany({ where: { handled: false }, orderBy: { createdAt: 'asc' }, take: 50 }),
        this.prisma.appRating.findMany({ where: { stars: { lte: 2 }, updatedAt: { gte: new Date(now.getTime() - THRESHOLDS.ratingLookbackDays * DAY) } } }),
        this.prisma.appError.count({ where: { createdAt: { gte: since24h } } }),
        this.prisma.appError.findFirst({ orderBy: { createdAt: 'desc' }, select: { message: true } }),
        this.databaseSizeMb(),
        this.prisma.user.count(),
      ]);

    const rabbitsOf = new Map(rabbitCounts.map((r) => [r.farmId, r._count._all]));
    const farmNames = new Map(farms.map((f) => [f.id, f.name]));
    return {
      now,
      monthlyPrice: settings.monthlyPrice,
      yearlyPrice: settings.yearlyPrice,
      appUrl: frontendUrl(),
      pendingPayments: payments.map((p) => ({ id: p.id, farmName: p.farm.name, amount: p.amount, plan: p.plan, reference: p.reference, createdAt: p.createdAt })),
      farms: farms.map((f) => {
        const exempt = f.freeAccess || f.memberships.some((m) => admins.includes(m.user.email.toLowerCase()));
        const access = accessOf(f, settings.trialDays, exempt, now);
        const owner = (f.memberships.find((m) => m.role === 'ADMIN') ?? f.memberships[0])?.user;
        const seen = f.memberships.map((m) => m.user.lastSeenAt?.getTime() ?? 0).reduce((a, b) => Math.max(a, b), 0);
        return {
          id: f.id, name: f.name, createdAt: f.createdAt, status: access.status, daysLeft: access.daysLeft,
          trialEndsAt: access.trialEndsAt, paidUntil: f.paidUntil,
          ownerEmail: owner?.email ?? null, ownerFirstName: owner?.firstName ?? null,
          rabbits: rabbitsOf.get(f.id) ?? 0, lastSeenAt: seen ? new Date(seen) : null,
        };
      }),
      newUsers24h,
      newFarms24h,
      contacts: contacts.map((c) => ({ id: c.id, name: c.name, contact: c.contact, message: c.message, createdAt: c.createdAt })),
      lowRatings: lowRatings.map((r) => ({ id: r.id, stars: r.stars, comment: r.comment, farmName: r.farmId ? farmNames.get(r.farmId) ?? null : null, updatedAt: r.updatedAt })),
      errors24h,
      lastError: lastError?.message ?? null,
      dbSizeMb,
      dbLimitMb: Number.parseInt(process.env.AGENT_DB_LIMIT_MB ?? '', 10) || 512,
      totalUsers,
      hostingPlan: (process.env.HOSTING_PLAN ?? 'hobby').trim().toLowerCase(),
    };
  }

  private async databaseSizeMb() {
    try {
      const rows = await this.prisma.$queryRaw<Array<{ size: bigint }>>`SELECT pg_database_size(current_database()) AS size`;
      return rows[0] ? Number(rows[0].size) / 1_000_000 : null;
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------
  // Tournée du matin (tâche planifiée) ou à la demande
  // ---------------------------------------------------------------

  async run(options: { now?: Date; notify?: boolean } = {}) {
    const now = options.now ?? new Date();
    const facts = await this.collectFacts(now);
    const findings = detect(facts);
    const created = await this.sync(findings);

    const pending = await this.prisma.agentSuggestion.count({ where: { status: AgentSuggestionStatus.PENDING } });
    const written = await this.writeBrief(facts, findings);
    const brief = await this.prisma.agentBrief.create({ data: { text: written.text, usedAi: written.usedAi, pending } });
    await this.journal('AGENT', null, 'BRIEF', `Point du matin : ${pending} action(s) à valider, ${created} nouvelle(s).`);
    await this.prisma.appError.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - 30 * DAY) } } });

    if (options.notify && pending > 0) await this.notifyOwners(brief.text, pending);
    return brief;
  }

  /** Crée les nouvelles propositions et retire celles dont la situation a disparu. */
  private async sync(findings: Finding[]) {
    const keys = findings.map((f) => f.key);
    const existing = new Set(
      (await this.prisma.agentSuggestion.findMany({ where: { key: { in: keys } }, select: { key: true } })).map((s) => s.key),
    );
    let created = 0;
    for (const f of findings) {
      const shown = { title: f.title, detail: f.detail ?? null, severity: f.severity, href: f.href ?? null };
      if (existing.has(f.key)) {
        // Le brouillon n'est pas réécrit : il a pu être amélioré entre-temps.
        await this.prisma.agentSuggestion.updateMany({ where: { key: f.key, status: AgentSuggestionStatus.PENDING }, data: shown });
        continue;
      }
      await this.prisma.agentSuggestion.create({
        data: {
          ...shown, key: f.key, kind: f.kind, action: f.action, targetId: f.targetId ?? null,
          recipient: f.recipient ?? null, subject: f.subject ?? null, draft: f.draft ?? null,
        },
      });
      created += 1;
    }
    const gone = await this.prisma.agentSuggestion.updateMany({
      where: { status: AgentSuggestionStatus.PENDING, key: { notIn: keys } },
      data: { status: AgentSuggestionStatus.EXPIRED, resolvedAt: new Date() },
    });
    if (gone.count) await this.journal('AGENT', null, 'EXPIRE', `${gone.count} proposition(s) retirée(s) : la situation est réglée.`);
    return created;
  }

  private async writeBrief(facts: AgentFacts, findings: Finding[]) {
    const plain = plainBrief(facts, findings);
    const summary = {
      date: facts.now.toISOString().slice(0, 10),
      aTraiter: findings.map((f) => ({ type: f.kind, urgence: f.severity, titre: f.title })),
      nouveauxComptes24h: facts.newUsers24h,
      nouveauxElevages24h: facts.newFarms24h,
      elevages: {
        essai: facts.farms.filter((f) => f.status === 'TRIAL').length,
        abonnes: facts.farms.filter((f) => f.status === 'ACTIVE').length,
        lectureSeule: facts.farms.filter((f) => f.status === 'EXPIRED').length,
        gratuits: facts.farms.filter((f) => f.status === 'EXEMPT').length,
      },
    };
    const text = await this.generate(BRIEF_RULES, [{ role: 'user', content: `Faits du jour (JSON) :\n${JSON.stringify(summary)}\n\nVersion simple déjà prête, à reformuler sans rien ajouter :\n${plain}` }], 400);
    return text ? { text, usedAi: true } : { text: plain, usedAi: false };
  }

  private async notifyOwners(text: string, pending: number) {
    const emails = platformAdmins();
    if (emails.length === 0) return;
    const url = `${frontendUrl()}/admin/agent`;
    const owners = await this.prisma.user.findMany({ where: { email: { in: emails, mode: 'insensitive' } }, select: { id: true, email: true } });
    for (const owner of owners) {
      await this.mail
        .send({
          to: owner.email,
          subject: `RabbitFarm : ton point du matin (${pending} action${pending > 1 ? 's' : ''} à valider)`,
          text: `${text}\n\nValide ou ignore chaque action ici : ${url}`,
        })
        .catch((e: unknown) => this.logger.warn(`E-mail du point du matin non envoyé : ${String(e)}`));
    }
    await this.notifications
      .sendToUsers(owners.map((o) => o.id), {
        title: 'RabbitFarm : ton point du matin',
        body: `${pending} action${pending > 1 ? 's' : ''} à valider. ${text.split('\n')[0]}`.slice(0, 180),
        url: '/admin/agent',
      })
      .catch((e: unknown) => this.logger.warn(`Notification du point du matin non envoyée : ${String(e)}`));
  }

  // ---------------------------------------------------------------
  // Lecture pour l'espace propriétaire
  // ---------------------------------------------------------------

  async overview(user: CurrentUserType) {
    this.assertAdmin(user);
    const [brief, pending] = await Promise.all([
      this.prisma.agentBrief.findFirst({ orderBy: { createdAt: 'desc' } }),
      this.prisma.agentSuggestion.findMany({ where: { status: AgentSuggestionStatus.PENDING } }),
    ]);
    return { brief, pending: pending.sort(bySeverity), aiEnabled: this.model !== null, mailEnabled: this.mail.configured };
  }

  async history(user: CurrentUserType) {
    this.assertAdmin(user);
    return this.prisma.agentSuggestion.findMany({
      where: { status: { not: AgentSuggestionStatus.PENDING } },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async log(user: CurrentUserType) {
    this.assertAdmin(user);
    return this.prisma.agentLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async refresh(user: CurrentUserType) {
    this.assertAdmin(user);
    await this.journal('OWNER', user.email, 'REFRESH', 'Point du matin relancé à la main.');
    return this.run({ notify: false });
  }

  // ---------------------------------------------------------------
  // Validation par la propriétaire
  // ---------------------------------------------------------------

  private async pendingOne(id: string) {
    const s = await this.prisma.agentSuggestion.findUnique({ where: { id } });
    if (!s || s.status !== AgentSuggestionStatus.PENDING) throw new NotFoundException('Proposition introuvable ou déjà traitée.');
    return s;
  }

  async approve(user: CurrentUserType, id: string, editedDraft?: string | null) {
    this.assertAdmin(user);
    const s = await this.pendingOne(id);
    const draft = editedDraft?.trim() || s.draft;
    let summary: string;

    switch (s.action) {
      case 'CONFIRM_PAYMENT':
        await this.subscriptions.confirmPayment(user, s.targetId!);
        summary = `Paiement confirmé : ${s.title}`;
        break;
      case 'EXTEND_TRIAL':
        await this.subscriptions.extendTrial(user, s.targetId!, THRESHOLDS.extendDays);
        summary = `${THRESHOLDS.extendDays} jours d’essai offerts : ${s.title}`;
        break;
      case 'SEND_EMAIL':
        await this.sendMail(s.recipient, s.subject, draft);
        summary = `E-mail envoyé à ${s.recipient} : ${s.subject ?? s.title}`;
        break;
      case 'REPLY_CONTACT':
        if (s.recipient?.includes('@')) {
          await this.sendMail(s.recipient, s.subject, draft);
          summary = `Réponse envoyée par e-mail à ${s.recipient}`;
        } else {
          summary = `Réponse envoyée sur WhatsApp à ${s.recipient ?? 'ce contact'}`;
        }
        if (s.targetId) await this.prisma.contactMessage.updateMany({ where: { id: s.targetId }, data: { handled: true } });
        break;
      default:
        summary = `Vu : ${s.title}`;
    }

    const done = await this.prisma.agentSuggestion.update({
      where: { id },
      data: { status: AgentSuggestionStatus.DONE, draft, resolvedBy: user.email, resolvedAt: new Date() },
    });
    await this.journal('OWNER', user.email, s.action, summary, id);
    return done;
  }

  async dismiss(user: CurrentUserType, id: string) {
    this.assertAdmin(user);
    const s = await this.pendingOne(id);
    const done = await this.prisma.agentSuggestion.update({
      where: { id },
      data: { status: AgentSuggestionStatus.DISMISSED, resolvedBy: user.email, resolvedAt: new Date() },
    });
    await this.journal('OWNER', user.email, 'DISMISS', `Ignoré : ${s.title}`, id);
    return done;
  }

  private async sendMail(to: string | null, subject: string | null, text: string | null) {
    if (!to || !text) throw new BadRequestException('Ce message n’a pas de destinataire ou de texte.');
    if (text.includes('[Réponse à compléter]')) throw new BadRequestException('Complète d’abord le passage « [Réponse à compléter] » du message.');
    if (!this.mail.configured) {
      throw new BadRequestException('L’envoi d’e-mails n’est pas configuré : ajoute RESEND_API_KEY dans Vercel (projet farm_backend).');
    }
    await this.mail.send({ to, subject: subject ?? 'RabbitFarm', text });
  }

  /** Réécrit le brouillon d'une proposition avec l'IA (ton chaleureux, plus court). */
  async improveDraft(user: CurrentUserType, id: string, current?: string | null) {
    this.assertAdmin(user);
    const s = await this.pendingOne(id);
    const base = current?.trim() || s.draft;
    if (!base) throw new BadRequestException('Cette proposition n’a pas de message à améliorer.');
    if (!this.model) throw new BadRequestException('L’IA n’est pas configurée sur le serveur.');
    const text = await this.generate(
      `Tu améliores un message que Diana, propriétaire de l'application RabbitFarm, va envoyer à un éleveur de lapins au Cameroun.
Garde le tutoiement, les faits, les prix, les dates et les liens exactement. Rends-le plus chaleureux, clair et court (120 mots au plus).
Si le message contient « [Réponse à compléter] », garde ce passage tel quel. Réponds uniquement par le message, sans commentaire.`,
      [{ role: 'user', content: `Contexte : ${s.title}${s.detail ? ` — ${s.detail}` : ''}\n\nMessage :\n${base}` }],
      500,
    );
    if (!text) throw new BadRequestException('L’IA n’a pas répondu, réessaie dans un instant.');
    const updated = await this.prisma.agentSuggestion.update({ where: { id }, data: { draft: text } });
    await this.journal('AGENT', null, 'IMPROVE_DRAFT', `Brouillon réécrit : ${s.title}`, id);
    return updated;
  }

  // ---------------------------------------------------------------
  // Questions libres
  // ---------------------------------------------------------------

  async ask(user: CurrentUserType, input: AskAgentInput) {
    this.assertAdmin(user);
    if (!this.model) throw new BadRequestException('L’IA n’est pas configurée sur le serveur.');
    const now = new Date();
    const [facts, stats, admin] = await Promise.all([
      this.collectFacts(now),
      this.platform.stats(user),
      this.subscriptions.admin(user),
    ]);
    const days = (d: Date | null) => (d ? Math.floor((now.getTime() - d.getTime()) / DAY) : null);
    const context = {
      date: now.toISOString().slice(0, 10),
      prix: { mensuel: facts.monthlyPrice, annuel: facts.yearlyPrice },
      plateforme: {
        elevages: stats.farms, utilisateurs: stats.users, nouveauxUtilisateurs30j: stats.newUsers30d,
        actifs7j: stats.activeUsers7d, actifs30j: stats.activeUsers30d, lapinsActifs: stats.rabbits,
        noteMoyenne: stats.averageRating, nombreDeNotes: stats.ratingsCount,
      },
      revenus: { trenteDerniersJours: admin.revenue30d, total: admin.revenueTotal, abonnes: admin.payingFarms, enEssai: admin.trialFarms, lectureSeule: admin.expiredFarms },
      paiementsEnAttente: facts.pendingPayments.map((p) => ({ elevage: p.farmName, montant: p.amount, formule: p.plan, reference: p.reference, declareIlYaJours: days(p.createdAt) })),
      elevages: facts.farms.slice(0, 80).map((f) => ({
        nom: f.name, statut: f.status, joursRestants: f.daysLeft, lapins: f.rabbits,
        inscritIlYaJours: days(f.createdAt), derniereConnexionIlYaJours: days(f.lastSeenAt),
      })),
      messagesNonTraites: facts.contacts.length,
      erreursServeur24h: facts.errors24h,
      nouveauxComptes24h: facts.newUsers24h,
    };
    const messages: ModelMessage[] = [
      ...(input.history ?? []).slice(-10).map((m): ModelMessage => (m.role === 'assistant' ? { role: 'assistant', content: m.content } : { role: 'user', content: m.content })),
      { role: 'user', content: input.question },
    ];
    const text = await this.generate(`${ASK_RULES}\n\nDonnées de la plateforme (JSON) :\n${JSON.stringify(context)}`, messages, 700);
    if (!text) throw new BadRequestException('L’IA n’a pas répondu, réessaie dans un instant.');
    await this.journal('OWNER', user.email, 'ASK', `Question : ${input.question.slice(0, 200)}`);
    return text;
  }

  // ---------------------------------------------------------------

  private async generate(system: string, messages: ModelMessage[], maxOutputTokens: number) {
    const candidates: Array<[LanguageModel | null, string | null]> = [
      [this.model, this.config.model],
      [this.fallback, this.config.fallbackModel],
    ];
    for (const [model, id] of candidates) {
      if (!model) continue;
      try {
        const result = await generateText({
          model,
          system,
          messages,
          maxOutputTokens,
          abortSignal: AbortSignal.timeout(this.config.timeoutMs),
          providerOptions: speedOptions(this.config, id),
        });
        const text = result.text.trim();
        if (text) return text;
      } catch (e) {
        this.logger.warn(`IA indisponible (${id}) : ${String(e).slice(0, 200)}`);
      }
    }
    return null;
  }

  private journal(actor: 'AGENT' | 'OWNER', actorEmail: string | null, action: string, summary: string, suggestionId?: string) {
    return this.prisma.agentLog.create({ data: { actor, actorEmail, action, summary: summary.slice(0, 500), suggestionId: suggestionId ?? null } });
  }
}
