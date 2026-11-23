import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { platformAdmins } from '../platform/platform.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import type { SubscriptionPayment, SubscriptionPlan } from '../generated/prisma/client.js';
import { frontendUrl } from '../auth/password-reset/password-reset.service.js';

import { AccessStatus } from './subscription.models.js';
import { DAY, accessOf, extendPeriod } from './access.js';
import { NotchPayClient, normalizeCameroonPhone, type MobileOperator } from './notchpay.client.js';

const SETTINGS_ID = 'default';
const CACHE_MS = 30_000;
const NOTCHPAY = 'NOTCHPAY';
const FAILED = new Set(['failed', 'canceled', 'cancelled', 'expired']);

export interface PlatformSettingsInput {
  trialDays?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  paymentInstructions?: string | null;
}

@Injectable()
export class SubscriptionService {
  /** Lecture seule par élevage, gardée 30 s pour ne pas interroger la base à chaque saisie. */
  private readonly readOnlyCache = new Map<string, { readOnly: boolean; until: number }>();

  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notchpay: NotchPayClient,
  ) {}

  private isAdmin(email: string) {
    return platformAdmins().includes(email.toLowerCase());
  }

  /** Exempté : propriétaire de l'app, élevage dont elle est membre, ou accès gratuit accordé. */
  private farmExempt(farm: { freeAccess: boolean; memberships: { user: { email: string } }[] }) {
    return farm.freeAccess || farm.memberships.some((m) => this.isAdmin(m.user.email));
  }

  private readonly farmAccessSelect = {
    createdAt: true, trialEndsAt: true, paidUntil: true, freeAccess: true,
    memberships: { select: { user: { select: { email: true } } } },
  } as const;

  private assertAdmin(user: CurrentUserType) {
    if (!this.isAdmin(user.email)) throw new ForbiddenException('Réservé à la propriétaire de l’application.');
  }

  async settings() {
    const row = await this.prisma.platformSetting.findUnique({ where: { id: SETTINGS_ID } });
    return row ?? { trialDays: 30, monthlyPrice: 2500, yearlyPrice: 25000, paymentInstructions: null };
  }

  private priceOf(plan: SubscriptionPlan, s: { monthlyPrice: number; yearlyPrice: number }) {
    return plan === 'YEARLY' ? s.yearlyPrice : s.monthlyPrice;
  }

  async status(user: CurrentUserType) {
    if (!user.farmId) {
      // Compte propriétaire sans ferme : toujours exempté.
      const settings = await this.settings();
      return { status: AccessStatus.EXEMPT, daysLeft: 0, trialEndsAt: new Date(), readOnly: false, paidUntil: null, settings, pendingPayment: null, onlinePaymentEnabled: this.notchpay.enabled };
    }
    const [farm, settings, pending] = await Promise.all([
      this.prisma.farm.findUniqueOrThrow({ where: { id: user.farmId }, select: this.farmAccessSelect }),
      this.settings(),
      this.prisma.subscriptionPayment.findFirst({ where: { farmId: user.farmId, status: 'PENDING', provider: null }, orderBy: { createdAt: 'desc' } }),
    ]);
    const access = accessOf(farm, settings.trialDays, this.isAdmin(user.email) || this.farmExempt(farm));
    return { ...access, paidUntil: farm.paidUntil, settings, pendingPayment: pending, onlinePaymentEnabled: this.notchpay.enabled };
  }

  /** Vrai si l'élevage ne peut plus que consulter ses données. */
  async isReadOnly(user: CurrentUserType) {
    if (this.isAdmin(user.email)) return false;
    const hit = this.readOnlyCache.get(user.farmId);
    if (hit && hit.until > Date.now()) return hit.readOnly;
    const [farm, settings] = await Promise.all([
      this.prisma.farm.findUnique({ where: { id: user.farmId }, select: this.farmAccessSelect }),
      this.settings(),
    ]);
    const readOnly = farm ? accessOf(farm, settings.trialDays, this.farmExempt(farm)).readOnly : false;
    this.readOnlyCache.set(user.farmId, { readOnly, until: Date.now() + CACHE_MS });
    return readOnly;
  }

  /** L'éleveur déclare avoir payé par Mobile Money ; la propriétaire confirme ensuite. */
  async declarePayment(user: CurrentUserType, plan: SubscriptionPlan, reference?: string) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Seul un administrateur de l’élevage peut gérer l’abonnement.');
    const ref = reference?.trim().slice(0, 100) || null;
    const settings = await this.settings();
    const pending = await this.prisma.subscriptionPayment.findFirst({ where: { farmId: user.farmId, status: 'PENDING', provider: null } });
    const data = { plan, amount: this.priceOf(plan, settings), reference: ref, requestedById: user.userId };
    return pending
      ? this.prisma.subscriptionPayment.update({ where: { id: pending.id }, data })
      : this.prisma.subscriptionPayment.create({ data: { ...data, farmId: user.farmId } });
  }

  // ---------- Paiement en ligne (NotchPay) ----------

  /**
   * Paiement Mobile Money en ligne. Avec un opérateur et un numéro, la demande arrive directement sur le
   * téléphone (l'éleveur reste dans l'app) ; sinon, ou si l'envoi direct échoue, on renvoie la page NotchPay.
   */
  async startOnlinePayment(user: CurrentUserType, plan: SubscriptionPlan, direct?: { operator: MobileOperator; phone: string }) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Seul un administrateur de l’élevage peut gérer l’abonnement.');
    if (!user.farmId) throw new BadRequestException('Aucun élevage à abonner.');
    if (!this.notchpay.enabled) throw new ServiceUnavailableException('Le paiement en ligne n’est pas encore disponible : utilise le paiement déclaré.');
    const phone = direct ? normalizeCameroonPhone(direct.phone) : null;
    if (direct && !phone) throw new BadRequestException('Numéro invalide : tape les 9 chiffres, par exemple 670 00 00 00.');
    const settings = await this.settings();
    const amount = this.priceOf(plan, settings);
    const payment = await this.prisma.subscriptionPayment.create({
      data: { farmId: user.farmId, plan, amount, provider: NOTCHPAY, requestedById: user.userId, reference: phone },
    });
    let created: { id: string | null; reference: string | null; url: string };
    try {
      created = await this.notchpay.checkout({
        amount,
        reference: payment.id,
        email: user.email,
        phone: phone ?? undefined,
        description: `Abonnement Rabbit Farm ${plan === 'YEARLY' ? 'annuel' : 'mensuel'}`,
        callback: `${frontendUrl()}/subscription`,
      });
    } catch (error) {
      await this.prisma.subscriptionPayment.update({ where: { id: payment.id }, data: { status: 'REJECTED' } });
      this.logger.warn(`Paiement NotchPay non créé : ${error instanceof Error ? error.message : String(error)}`);
      throw new ServiceUnavailableException('Le paiement en ligne ne répond pas pour le moment. Réessaie plus tard ou utilise le paiement déclaré.');
    }
    await this.prisma.subscriptionPayment.update({ where: { id: payment.id }, data: { providerRef: created.id, checkoutUrl: created.url } });
    if (!direct || !phone) return { paymentId: payment.id, url: created.url, direct: false };
    try {
      await this.notchpay.charge(created.reference ?? created.id ?? payment.id, direct.operator, phone);
      return { paymentId: payment.id, url: created.url, direct: true };
    } catch (error) {
      // L'envoi direct a échoué : la page NotchPay reste un secours, avec le même paiement.
      this.logger.warn(`Paiement direct NotchPay refusé : ${error instanceof Error ? error.message : String(error)}`);
      return { paymentId: payment.id, url: created.url, direct: false };
    }
  }

  /** Au retour de la page NotchPay : relit le paiement et active l'abonnement s'il est payé. */
  async checkOnlinePayment(user: CurrentUserType, reference: string) {
    const ref = reference.trim().slice(0, 100);
    const payment = await this.prisma.subscriptionPayment.findFirst({
      where: { farmId: user.farmId, provider: NOTCHPAY, OR: [{ id: ref }, { providerRef: ref }] },
    });
    if (!payment) throw new NotFoundException('Paiement introuvable.');
    return this.syncOnline(payment);
  }

  /** Webhook NotchPay : signature vérifiée, puis paiement relu chez NotchPay (le contenu reçu n'est jamais cru). */
  async handleWebhook(rawBody: Buffer | string | undefined, signature: string | undefined, body: unknown) {
    if (!rawBody || !this.notchpay.verify(rawBody, signature)) throw new UnauthorizedException('Signature invalide.');
    const data = (body as { data?: Record<string, unknown> } | null)?.data ?? {};
    const nested = data.transaction && typeof data.transaction === 'object' ? (data.transaction as Record<string, unknown>) : {};
    const refs = [data.reference, data.id, nested.reference, nested.id, data.merchant_reference]
      .filter((v): v is string => typeof v === 'string' && v.length > 0 && v.length <= 100);
    if (!refs.length) return { ok: true };
    const payment = await this.prisma.subscriptionPayment.findFirst({
      where: { provider: NOTCHPAY, OR: [{ id: { in: refs } }, { providerRef: { in: refs } }] },
    });
    if (payment) await this.syncOnline(payment);
    return { ok: true };
  }

  private async syncOnline(payment: SubscriptionPayment): Promise<SubscriptionPayment> {
    if (payment.status !== 'PENDING') return payment;
    const remote = (payment.providerRef && (await this.notchpay.retrieve(payment.providerRef))) || (await this.notchpay.retrieve(payment.id));
    if (!remote) return payment;
    // Le paiement relu doit bien être celui-ci (notre référence ou l'identifiant NotchPay enregistré).
    const sameId = Boolean(payment.providerRef) && remote.id === payment.providerRef;
    if (remote.reference && remote.reference !== payment.id && !sameId) return payment;
    if (FAILED.has(remote.status)) {
      await this.prisma.subscriptionPayment.updateMany({ where: { id: payment.id, status: 'PENDING' }, data: { status: 'REJECTED' } });
      return this.prisma.subscriptionPayment.findUniqueOrThrow({ where: { id: payment.id } });
    }
    const paid = remote.status === 'complete' && (remote.amount ?? 0) >= payment.amount && (!remote.currency || remote.currency.toUpperCase() === 'XAF');
    if (!paid) return payment;
    await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.subscriptionPayment.updateMany({ where: { id: payment.id, status: 'PENDING' }, data: { status: 'CONFIRMED', confirmedAt: new Date() } });
      if (!claimed.count) return;
      const farm = await tx.farm.findUniqueOrThrow({ where: { id: payment.farmId }, select: { paidUntil: true } });
      const periodEnd = extendPeriod(farm.paidUntil, payment.plan);
      await tx.subscriptionPayment.update({ where: { id: payment.id }, data: { periodEnd } });
      await tx.farm.update({ where: { id: payment.farmId }, data: { paidUntil: periodEnd } });
    });
    this.readOnlyCache.delete(payment.farmId);
    return this.prisma.subscriptionPayment.findUniqueOrThrow({ where: { id: payment.id } });
  }

  // ---------- Propriétaire de l'app ----------

  async admin(user: CurrentUserType) {
    this.assertAdmin(user);
    const now = new Date();
    const [settings, pending, farms, confirmed] = await Promise.all([
      this.settings(),
      this.prisma.subscriptionPayment.findMany({ where: { status: 'PENDING', provider: null }, orderBy: { createdAt: 'asc' }, include: { farm: { select: { name: true } } } }),
      this.prisma.farm.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, createdAt: true, trialEndsAt: true, paidUntil: true, freeAccess: true,
          memberships: { orderBy: { createdAt: 'asc' }, select: { role: true, user: { select: { email: true } } } },
        },
      }),
      this.prisma.subscriptionPayment.findMany({ where: { status: 'CONFIRMED' }, select: { amount: true, confirmedAt: true } }),
    ]);
    const rows = farms.map((f) => {
      const ownerEmail = (f.memberships.find((m) => m.role === 'ADMIN') ?? f.memberships[0])?.user.email ?? null;
      const a = accessOf(f, settings.trialDays, this.farmExempt(f), now);
      return {
        farmId: f.id, farmName: f.name, ownerEmail, createdAt: f.createdAt, paidUntil: f.paidUntil, freeAccess: f.freeAccess,
        memberEmails: f.memberships.map((m) => m.user.email), ...a,
      };
    });
    const count = (s: AccessStatus) => rows.filter((r) => r.status === s).length;
    return {
      settings,
      pendingPayments: pending.map((p) => ({ ...p, farmName: p.farm.name })),
      farms: rows,
      revenue30d: confirmed.filter((p) => p.confirmedAt && p.confirmedAt.getTime() > now.getTime() - 30 * DAY).reduce((s, p) => s + p.amount, 0),
      revenueTotal: confirmed.reduce((s, p) => s + p.amount, 0),
      payingFarms: count(AccessStatus.ACTIVE),
      trialFarms: count(AccessStatus.TRIAL),
      expiredFarms: count(AccessStatus.EXPIRED),
    };
  }

  async updateSettings(user: CurrentUserType, input: PlatformSettingsInput) {
    this.assertAdmin(user);
    const int = (v: number | undefined, min: number, max: number, label: string) => {
      if (v === undefined) return undefined;
      if (!Number.isInteger(v) || v < min || v > max) throw new BadRequestException(`${label} doit être entre ${min} et ${max}.`);
      return v;
    };
    const data = {
      trialDays: int(input.trialDays, 0, 365, 'La durée d’essai'),
      monthlyPrice: int(input.monthlyPrice, 0, 10_000_000, 'Le prix mensuel'),
      yearlyPrice: int(input.yearlyPrice, 0, 100_000_000, 'Le prix annuel'),
      paymentInstructions: input.paymentInstructions === undefined ? undefined : input.paymentInstructions?.trim().slice(0, 1000) || null,
    };
    this.readOnlyCache.clear();
    return this.prisma.platformSetting.upsert({ where: { id: SETTINGS_ID }, create: { id: SETTINGS_ID, ...data }, update: data });
  }

  /** Confirme un paiement déclaré : prolonge l'abonnement d'un mois ou d'un an. */
  async confirmPayment(user: CurrentUserType, paymentId: string) {
    this.assertAdmin(user);
    const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId }, include: { farm: true } });
    if (!payment || payment.status !== 'PENDING') throw new NotFoundException('Paiement introuvable ou déjà traité.');
    const periodEnd = extendPeriod(payment.farm.paidUntil, payment.plan);
    const [updated] = await this.prisma.$transaction([
      this.prisma.subscriptionPayment.update({ where: { id: paymentId }, data: { status: 'CONFIRMED', periodEnd, confirmedAt: new Date() } }),
      this.prisma.farm.update({ where: { id: payment.farmId }, data: { paidUntil: periodEnd } }),
    ]);
    this.readOnlyCache.delete(payment.farmId);
    return updated;
  }

  async rejectPayment(user: CurrentUserType, paymentId: string) {
    this.assertAdmin(user);
    const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status !== 'PENDING') throw new NotFoundException('Paiement introuvable ou déjà traité.');
    return this.prisma.subscriptionPayment.update({ where: { id: paymentId }, data: { status: 'REJECTED' } });
  }

  /** Abonnement enregistré à la main (paiement reçu hors de l'app). */
  async activate(user: CurrentUserType, farmId: string, plan: SubscriptionPlan) {
    this.assertAdmin(user);
    const [farm, settings] = await Promise.all([this.prisma.farm.findUnique({ where: { id: farmId } }), this.settings()]);
    if (!farm) throw new NotFoundException('Élevage introuvable.');
    const periodEnd = extendPeriod(farm.paidUntil, plan);
    await this.prisma.$transaction([
      this.prisma.subscriptionPayment.create({
        data: { farmId, plan, amount: this.priceOf(plan, settings), status: 'CONFIRMED', periodEnd, confirmedAt: new Date(), requestedById: user.userId },
      }),
      this.prisma.farm.update({ where: { id: farmId }, data: { paidUntil: periodEnd } }),
    ]);
    this.readOnlyCache.delete(farmId);
    return true;
  }

  /** Accorde ou retire l'accès gratuit à vie d'un élevage. */
  async setFreeAccess(user: CurrentUserType, farmId: string, free: boolean) {
    this.assertAdmin(user);
    await this.prisma.farm.update({ where: { id: farmId }, data: { freeAccess: free } });
    this.readOnlyCache.delete(farmId);
    return true;
  }

  /** Offre des jours d'essai en plus à un élevage. */
  async extendTrial(user: CurrentUserType, farmId: string, days: number) {
    this.assertAdmin(user);
    if (!Number.isInteger(days) || days < 1 || days > 365) throw new BadRequestException('Entre 1 et 365 jours.');
    const [farm, settings] = await Promise.all([this.prisma.farm.findUnique({ where: { id: farmId } }), this.settings()]);
    if (!farm) throw new NotFoundException('Élevage introuvable.');
    const current = accessOf(farm, settings.trialDays, false).trialEndsAt;
    const base = current > new Date() ? current : new Date();
    await this.prisma.farm.update({ where: { id: farmId }, data: { trialEndsAt: new Date(base.getTime() + days * DAY) } });
    this.readOnlyCache.delete(farmId);
    return true;
  }
}
