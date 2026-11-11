import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { GenealogyService } from '../genetics/genealogy.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import {
  MortalityScope,
  PregnancyResult,
  RabbitStatus,
  SaleStatus,
} from '../generated/prisma/client.js';

import {
  average,
  averageWeightByAge,
  breederPerformances,
  estimatedCostPerKg,
  lastMonths,
  monthKey,
  rate,
  type LitterFacts,
} from './statistics.utils.js';

const DAY = 86_400_000;

function round2(value: number) {
  return Number(value.toFixed(2));
}

function countBy<T>(items: T[], key: (item: T) => string, weight: (item: T) => number = () => 1) {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + weight(item));
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value: round2(value) }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Statistiques techniques, génétiques, financières
 * et de population (§50 à §53).
 */
@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genealogy: GenealogyService,
  ) {}

  private period(from?: Date, to?: Date) {
    const end = to ? new Date(to) : new Date();
    const start = from ? new Date(from) : new Date(end.getTime() - 365 * DAY);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Période invalide.');
    }
    if (start > end) {
      throw new BadRequestException('La date de début doit précéder la date de fin.');
    }
    return { start, end };
  }

  async farmStatistics(currentUser: CurrentUserType, from?: Date, to?: Date) {
    const farmId = currentUser.farmId;
    const { start, end } = this.period(from, to);
    const range = { gte: start, lte: end };

    const [
      breedings,
      pregnancies,
      litters,
      weanings,
      mortalities,
      weighings,
      sales,
      payments,
      expenses,
      activeRabbits,
      exitedRabbits,
      riskyPairs,
    ] = await Promise.all([
      this.prisma.breeding.count({ where: { farmId, breedingDate: range } }),
      this.prisma.pregnancy.findMany({
        where: { farmId, checkDate: range },
        select: { result: true },
      }),
      this.prisma.litter.findMany({
        where: { farmId, birthDate: range },
        select: {
          id: true,
          motherId: true,
          fatherId: true,
          liveBorn: true,
          stillBorn: true,
          mother: { select: { code: true } },
          father: { select: { code: true } },
          weanings: {
            where: { actualDate: { not: null } },
            select: { quantity: true },
          },
        },
      }),
      this.prisma.weaning.findMany({
        where: { farmId, actualDate: range },
        select: { quantity: true, averageWeight: true },
      }),
      this.prisma.mortalityRecord.findMany({
        where: { farmId, date: range },
        select: { scope: true, count: true, cause: true, litterId: true, lotId: true },
      }),
      this.prisma.weighing.findMany({
        where: {
          date: range,
          OR: [{ rabbit: { farmId } }, { lot: { farmId } }],
        },
        select: { ageInDays: true, averageWeight: true, animalCount: true, totalWeight: true },
      }),
      this.prisma.sale.findMany({
        where: { farmId, saleDate: range, status: { not: SaleStatus.CANCELLED } },
        select: {
          saleDate: true,
          totalAmount: true,
          items: { select: { quantity: true, weightKg: true } },
        },
      }),
      this.prisma.payment.findMany({
        where: {
          paymentDate: range,
          sale: { farmId, status: { not: SaleStatus.CANCELLED } },
        },
        select: { amount: true },
      }),
      this.prisma.expense.findMany({
        where: { farmId, date: range },
        select: { amount: true, category: true, date: true },
      }),
      this.prisma.rabbit.findMany({
        where: { farmId, status: RabbitStatus.ACTIVE },
        select: { sex: true, purpose: true, breed: { select: { name: true } } },
      }),
      this.prisma.rabbit.findMany({
        where: { farmId, status: { not: RabbitStatus.ACTIVE }, exitDate: range },
        select: { status: true },
      }),
      this.genealogy.riskyPairs(currentUser, 1000),
    ]);

    // -------- Technique (§50, §51)
    const palpations = pregnancies.filter((p) => p.result !== PregnancyResult.INCONCLUSIVE);
    const positivePalpations = palpations.filter((p) => p.result === PregnancyResult.PREGNANT).length;

    const liveBorn = litters.reduce((s, l) => s + l.liveBorn, 0);
    const stillBorn = litters.reduce((s, l) => s + l.stillBorn, 0);

    const deathsByLitter = new Map<string, number>();
    let preWeaningDeaths = 0;
    let fatteningDeaths = 0;
    for (const m of mortalities) {
      if (m.lotId || m.scope === MortalityScope.LOT) {
        fatteningDeaths += m.count;
      } else if (m.litterId) {
        preWeaningDeaths += m.count;
        deathsByLitter.set(m.litterId, (deathsByLitter.get(m.litterId) ?? 0) + m.count);
      }
    }
    const totalDeaths = mortalities.reduce((s, m) => s + m.count, 0);

    const weaned = weanings.reduce((s, w) => s + w.quantity, 0);
    const weaningWeights = weanings
      .filter((w) => w.averageWeight != null)
      .map((w) => Number(w.averageWeight));

    const weightSamples = weighings.map((w) => ({
      ageInDays: w.ageInDays,
      animalCount: w.animalCount,
      averageWeight:
        w.averageWeight ?? (w.animalCount ? w.totalWeight / w.animalCount : null),
    }));

    // -------- Génétique (§52)
    const facts: LitterFacts[] = litters.map((l) => ({
      motherId: l.motherId,
      fatherId: l.fatherId,
      liveBorn: l.liveBorn,
      stillBorn: l.stillBorn,
      deaths: deathsByLitter.get(l.id) ?? 0,
      weaned: l.weanings.reduce((s, w) => s + w.quantity, 0),
    }));

    const codes = new Map<string, string>();
    for (const l of litters) {
      codes.set(l.motherId, l.mother.code);
      if (l.fatherId && l.father) codes.set(l.fatherId, l.father.code);
    }

    const rank = (role: 'mother' | 'father') =>
      breederPerformances(facts, role)
        .map((p) => ({ ...p, rabbitCode: codes.get(p.rabbitId) ?? '?' }))
        .sort(
          (a, b) =>
            (b.weaned - a.weaned) ||
            ((b.averageLitterSize ?? 0) - (a.averageLitterSize ?? 0)),
        )
        .slice(0, 10);

    // -------- Finances (§53)
    const revenue = sales.reduce((s, sale) => s + Number(sale.totalAmount), 0);
    const collected = payments.reduce((s, p) => s + Number(p.amount), 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const rabbitsSold = sales.reduce(
      (s, sale) => s + sale.items.reduce((n, item) => n + item.quantity, 0),
      0,
    );
    const kgSold = sales.reduce(
      (s, sale) => s + sale.items.reduce((n, item) => n + (item.weightKg ?? 0), 0),
      0,
    );

    const months = lastMonths(12, end);
    const monthly = months.map((month) => {
      const rev = sales
        .filter((sale) => monthKey(sale.saleDate) === month)
        .reduce((s, sale) => s + Number(sale.totalAmount), 0);
      const exp = expenses
        .filter((e) => monthKey(e.date) === month)
        .reduce((s, e) => s + Number(e.amount), 0);
      return { month, revenue: round2(rev), expenses: round2(exp), margin: round2(rev - exp) };
    });

    return {
      from: start,
      to: end,
      technical: {
        breedings,
        palpations: palpations.length,
        positivePalpations,
        fertilityRate: rate(positivePalpations, palpations.length),
        births: litters.length,
        liveBorn,
        stillBorn,
        averageLitterSize: average(litters.map((l) => l.liveBorn)),
        stillBirthRate: rate(stillBorn, liveBorn + stillBorn),
        preWeaningDeaths,
        preWeaningMortalityRate: rate(preWeaningDeaths, liveBorn),
        weaned,
        weaningRate: rate(weaned, liveBorn),
        averageWeaningWeight: average(weaningWeights),
        fatteningDeaths,
        totalDeaths,
        deathsByCause: countBy(mortalities, (m) => m.cause || 'Non précisée', (m) => m.count),
        weightByAge: averageWeightByAge(weightSamples),
      },
      genetic: {
        bestMothers: rank('mother'),
        bestFathers: rank('father'),
        blockedPairs: riskyPairs.filter((p) => p.level === 'BLOCKED').length,
        riskyPairs: riskyPairs.filter((p) => p.level === 'WARNING').length,
        breedDistribution: countBy(activeRabbits, (r) => r.breed?.name ?? 'Sans race'),
      },
      finance: {
        revenue: round2(revenue),
        collected: round2(collected),
        outstanding: round2(Math.max(0, revenue - collected)),
        expenses: round2(totalExpenses),
        margin: round2(revenue - totalExpenses),
        rabbitsSold,
        kgSold: round2(kgSold),
        estimatedCostPerKg: estimatedCostPerKg(totalExpenses, kgSold),
        expensesByCategory: countBy(expenses, (e) => e.category, (e) => Number(e.amount)),
        monthly,
      },
      population: {
        active: activeRabbits.length,
        bySex: countBy(activeRabbits, (r) => r.sex),
        byPurpose: countBy(activeRabbits, (r) => r.purpose),
        exits: countBy(exitedRabbits, (r) => r.status),
      },
    };
  }
}
