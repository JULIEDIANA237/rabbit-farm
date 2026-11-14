import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import {
  BreedingStatus,
  InventoryItemType,
  LitterStatus,
  RabbitStatus,
  StockMovementType,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CurrentUserType } from '../../auth/types/current-user.type.js';
import { TaskAutomationService } from '../automation/task-automation.service.js';
import { SetFeedRationsInput } from './feeding.models.js';
import {
  addDays,
  countHeadcounts,
  dailyNeed,
  type FeedingCategoryKey,
  type Headcounts,
  pendingDays,
  round,
  startOfDay,
} from './feeding-plan.js';

/**
 * Rations journalières (§46 étendu) : quantité d'aliment par lapin et
 * par jour selon son état (gestante, allaitante, engraissement,
 * entretien). Le besoin de la ferme se calcule sur l'effectif actuel
 * et se déduit du stock à la demande, jour par jour.
 */
@Injectable()
export class FeedingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly automation: TaskAutomationService,
  ) {}

  async headcounts(farmId: string): Promise<Headcounts> {
    const [rabbits, pregnant, lactating] = await Promise.all([
      this.prisma.rabbit.findMany({
        where: { farmId, status: RabbitStatus.ACTIVE },
        select: { id: true, sex: true, purpose: true, birthLitter: { select: { status: true } } },
      }),
      this.prisma.breeding.findMany({
        where: { farmId, status: BreedingStatus.PREGNANT },
        select: { femaleId: true },
      }),
      this.prisma.litter.findMany({
        where: { farmId, status: LitterStatus.ACTIVE, currentCount: { gt: 0 } },
        select: { motherId: true },
      }),
    ]);
    return countHeadcounts(
      rabbits.map((r) => ({ id: r.id, sex: r.sex, purpose: r.purpose, birthLitterStatus: r.birthLitter?.status ?? null })),
      new Set(pregnant.map((b) => b.femaleId)),
      new Set(lactating.map((l) => l.motherId)),
    );
  }

  private planFor(
    item: {
      id: string;
      name: string;
      unit: string;
      currentStock: number;
      unitPrice: { toString(): string } | null;
      rationsAppliedUntil: Date | null;
      rations: Array<{ category: FeedingCategoryKey; dailyQuantity: number }>;
    },
    counts: Headcounts,
    now: Date,
  ) {
    const need = dailyNeed(item.rations, counts);
    const days = need > 0 ? pendingDays(item.rationsAppliedUntil, now) : 0;
    const pendingQuantity = round(Math.min(item.currentStock, days * need));
    const estimatedStock = round(item.currentStock - pendingQuantity);
    const autonomyDays = need > 0 ? round(estimatedStock / need, 1) : null;
    const unitPrice = item.unitPrice != null ? Number(item.unitPrice) : null;
    return {
      inventoryItemId: item.id,
      name: item.name,
      unit: item.unit,
      currentStock: item.currentStock,
      unitPrice,
      rations: item.rations.map((r) => ({ category: r.category, dailyQuantity: r.dailyQuantity })),
      dailyNeed: need,
      dailyCost: unitPrice != null ? round(need * unitPrice, 0) : null,
      appliedUntil: item.rationsAppliedUntil,
      pendingDays: days,
      pendingQuantity,
      estimatedStock,
      autonomyDays,
      depletionDate: autonomyDays != null ? addDays(startOfDay(now), Math.floor(autonomyDays)) : null,
    };
  }

  async plan(currentUser: CurrentUserType, now = new Date()) {
    const [counts, items] = await Promise.all([
      this.headcounts(currentUser.farmId),
      this.prisma.inventoryItem.findMany({
        where: {
          farmId: currentUser.farmId,
          OR: [{ type: InventoryItemType.FEED }, { rations: { some: {} } }],
        },
        include: { rations: true },
        orderBy: { name: 'asc' },
      }),
    ]);
    return {
      headcounts: counts,
      items: items.map((item) => this.planFor(item, counts, now)),
    };
  }

  async setRations(input: SetFeedRationsInput, currentUser: CurrentUserType) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: input.inventoryItemId, farmId: currentUser.farmId },
      include: { rations: true },
    });
    if (!item) {
      throw new NotFoundException('Article de stock introuvable.');
    }
    for (const ration of input.rations) {
      if (!Number.isFinite(ration.dailyQuantity) || ration.dailyQuantity < 0) {
        throw new BadRequestException('Une ration ne peut pas être négative.');
      }
      if (ration.dailyQuantity > 5) {
        throw new BadRequestException(
          `Ration trop élevée (${ration.dailyQuantity} ${item.unit} par lapin et par jour). Vérifie l'unité.`,
        );
      }
    }
    const startDate = input.startDate ? new Date(input.startDate) : null;
    if (startDate && Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('La date de début est invalide.');
    }

    await this.prisma.$transaction(async (tx) => {
      for (const ration of input.rations) {
        if (ration.dailyQuantity === 0) {
          await tx.feedRation.deleteMany({ where: { inventoryItemId: item.id, category: ration.category } });
        } else {
          await tx.feedRation.upsert({
            where: { inventoryItemId_category: { inventoryItemId: item.id, category: ration.category } },
            create: {
              farmId: currentUser.farmId,
              inventoryItemId: item.id,
              category: ration.category,
              dailyQuantity: ration.dailyQuantity,
            },
            update: { dailyQuantity: ration.dailyQuantity },
          });
        }
      }
      // Point de départ du calcul : date choisie, sinon la dernière
      // déduction, sinon aujourd'hui (rien n'est déduit rétroactivement).
      const appliedUntil = startDate ?? item.rationsAppliedUntil ?? startOfDay(new Date());
      await tx.inventoryItem.update({
        where: { id: item.id },
        data: { rationsAppliedUntil: startOfDay(appliedUntil) },
      });
    });

    const plan = await this.plan(currentUser);
    return plan.items.find((i) => i.inventoryItemId === item.id)!;
  }

  /**
   * Déduit du stock les rations des jours écoulés depuis la dernière
   * déduction (sur l'effectif actuel), par un mouvement « consommation ».
   */
  async applyRations(inventoryItemId: string, currentUser: CurrentUserType, now = new Date()) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, farmId: currentUser.farmId },
      include: { rations: true },
    });
    if (!item) {
      throw new NotFoundException('Article de stock introuvable.');
    }
    const counts = await this.headcounts(currentUser.farmId);
    const plan = this.planFor(item, counts, now);
    if (plan.pendingDays === 0 || plan.dailyNeed === 0) {
      throw new BadRequestException('Aucune ration à déduire pour le moment.');
    }
    const from = startOfDay(item.rationsAppliedUntil ?? now);
    const until = addDays(from, plan.pendingDays);
    const shortage = round(plan.pendingDays * plan.dailyNeed - plan.pendingQuantity);

    return this.prisma.$transaction(async (tx) => {
      let movement = null;
      if (plan.pendingQuantity > 0) {
        movement = await tx.stockMovement.create({
          data: {
            inventoryItemId: item.id,
            type: StockMovementType.CONSUMPTION,
            quantity: plan.pendingQuantity,
            date: addDays(until, -1),
            unitCost: item.unitPrice,
            description:
              `Rations du ${from.toISOString().slice(0, 10)} au ${addDays(until, -1).toISOString().slice(0, 10)} ` +
              `(${plan.pendingDays} j × ${plan.dailyNeed} ${item.unit})` +
              (shortage > 0 ? ` — stock insuffisant : ${shortage} ${item.unit} manquants` : ''),
          },
        });
        await tx.inventoryItem.update({
          where: { id: item.id },
          data: { currentStock: round(item.currentStock - plan.pendingQuantity), rationsAppliedUntil: until },
        });
      } else {
        await tx.inventoryItem.update({ where: { id: item.id }, data: { rationsAppliedUntil: until } });
      }
      await this.automation.onStockChanged(currentUser.farmId, item.id, tx);
      return movement ? { ...movement, unitCost: movement.unitCost != null ? Number(movement.unitCost) : null } : null;
    });
  }
}
