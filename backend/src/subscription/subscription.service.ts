import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { platformAdmins } from '../platform/platform.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import type { SubscriptionPlan } from '../generated/prisma/client.js';

import { AccessStatus } from './subscription.models.js';
import { DAY, accessOf, extendPeriod } from './access.js';

const SETTINGS_ID = 'default';
const CACHE_MS = 30_000;

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

  constructor(private readonly prisma: PrismaService) {}

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
    return row ?? { trialDays: 30, monthlyPrice: 1000, yearlyPrice: 10000, paymentInstructions: null };
  }

  private priceOf(plan: SubscriptionPlan, s: { monthlyPrice: number; yearlyPrice: number }) {
    return plan === 'YEARLY' ? s.yearlyPrice : s.monthlyPrice;
  }

  async status(user: CurrentUserType) {
    if (!user.farmId) {
      // Compte propriétaire sans ferme : toujours exempté.
      const settings = await this.settings();
      return { status: AccessStatus.EXEMPT, daysLeft: 0, trialEndsAt: new Date(), readOnly: false, paidUntil: null, settings, pendingPayment: null };
    }
    const [farm, settings, pending] = await Promise.all([
      this.prisma.farm.findUniqueOrThrow({ where: { id: user.farmId }, select: this.farmAccessSelect }),
      this.settings(),
      this.prisma.subscriptionPayment.findFirst({ where: { farmId: user.farmId, status: 'PENDING' }, orderBy: { createdAt: 'desc' } }),
    ]);
    const access = accessOf(farm, settings.trialDays, this.isAdmin(user.email) || this.farmExempt(farm));
    return { ...access, paidUntil: farm.paidUntil, settings, pendingPayment: pending };
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
    const pending = await this.prisma.subscriptionPayment.findFirst({ where: { farmId: user.farmId, status: 'PENDING' } });
    const data = { plan, amount: this.priceOf(plan, settings), reference: ref, requestedById: user.userId };
    return pending
      ? this.prisma.subscriptionPayment.update({ where: { id: pending.id }, data })
      : this.prisma.subscriptionPayment.create({ data: { ...data, farmId: user.farmId } });
  }

  // ---------- Propriétaire de l'app ----------

  async admin(user: CurrentUserType) {
    this.assertAdmin(user);
    const now = new Date();
    const [settings, pending, farms, confirmed] = await Promise.all([
      this.settings(),
      this.prisma.subscriptionPayment.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' }, include: { farm: { select: { name: true } } } }),
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
