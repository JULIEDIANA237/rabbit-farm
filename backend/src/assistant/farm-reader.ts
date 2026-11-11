import {
  BreedingStatus,
  LitterStatus,
  RabbitStatus,
  TaskStatus,
} from '../generated/prisma/client.js';

import type { PrismaService } from '../prisma/prisma.service.js';
import { computeAutonomy } from '../operations/automation/stock-autonomy.js';
import type { FormLookups, OpenBreedingRef, RabbitRef } from './assistant-forms.js';

/**
 * Lectures (et uniquement des lectures) des données d'une ferme,
 * utilisées par les outils de l'assistant et par le point du jour.
 * Toutes les requêtes sont filtrées sur `farmId`.
 */

const DAY = 86_400_000;
const day = (date: Date | null | undefined) => (date ? date.toISOString().slice(0, 10) : null);
const OPEN_BREEDING = [
  BreedingStatus.PLANNED,
  BreedingStatus.AWAITING_PALPATION,
  BreedingStatus.PREGNANT,
  BreedingStatus.INCONCLUSIVE,
];
const OPEN_TASK = [TaskStatus.TODO, TaskStatus.IN_PROGRESS];

export class FarmReader implements FormLookups {
  constructor(
    private readonly prisma: PrismaService,
    private readonly farmId: string,
    private readonly now: Date = new Date(),
  ) {}

  private since(days: number) {
    return new Date(this.now.getTime() - days * DAY);
  }

  private startOfToday() {
    const start = new Date(this.now);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  // ---------------------------------------------------------------
  // Recherche par code (utilisée aussi pour convertir les brouillons)
  // ---------------------------------------------------------------

  async findRabbit(code: string): Promise<RabbitRef | null> {
    const normalized = code.trim();
    if (!normalized) return null;
    const rabbit = await this.prisma.rabbit.findFirst({
      where: {
        farmId: this.farmId,
        OR: [
          { code: { equals: normalized, mode: 'insensitive' } },
          { originalCode: { equals: normalized, mode: 'insensitive' } },
        ],
      },
      select: { id: true, code: true, sex: true, status: true },
      orderBy: { status: 'asc' },
    });
    return rabbit;
  }

  async findOpenBreeding(femaleId: string): Promise<OpenBreedingRef | null> {
    return this.prisma.breeding.findFirst({
      where: { farmId: this.farmId, femaleId, status: { in: OPEN_BREEDING } },
      orderBy: { breedingDate: 'desc' },
      select: { id: true, status: true },
    });
  }

  // ---------------------------------------------------------------
  // Vue d'ensemble
  // ---------------------------------------------------------------

  async overview() {
    const farmId = this.farmId;
    const [farm, rabbits, litters, breedings, openTasks, overdueTasks, mortality30, sales30] =
      await Promise.all([
        this.prisma.farm.findUnique({ where: { id: farmId }, select: { name: true } }),
        this.prisma.rabbit.groupBy({
          by: ['sex', 'purpose'],
          where: { farmId, status: RabbitStatus.ACTIVE },
          _count: { _all: true },
        }),
        this.prisma.litter.aggregate({
          where: { farmId, status: LitterStatus.ACTIVE },
          _count: { _all: true },
          _sum: { currentCount: true },
        }),
        this.prisma.breeding.groupBy({
          by: ['status'],
          where: { farmId, status: { in: OPEN_BREEDING } },
          _count: { _all: true },
        }),
        this.prisma.task.count({ where: { farmId, status: { in: OPEN_TASK } } }),
        this.prisma.task.count({
          where: { farmId, status: { in: OPEN_TASK }, dueDate: { lt: this.startOfToday() } },
        }),
        this.prisma.mortalityRecord.aggregate({
          where: { farmId, date: { gte: this.since(30) } },
          _sum: { count: true },
        }),
        this.prisma.sale.aggregate({
          where: { farmId, saleDate: { gte: this.since(30) }, status: { not: 'CANCELLED' } },
          _count: { _all: true },
          _sum: { totalAmount: true },
        }),
      ]);

    return {
      farm: farm?.name ?? null,
      today: day(this.now),
      activeRabbits: rabbits.map((row) => ({ sex: row.sex, purpose: row.purpose, count: row._count._all })),
      activeLitters: litters._count._all,
      kitsUnderMothers: litters._sum.currentCount ?? 0,
      breedingsInProgress: breedings.map((row) => ({ status: row.status, count: row._count._all })),
      openTasks,
      overdueTasks,
      deathsLast30Days: mortality30._sum.count ?? 0,
      salesLast30Days: {
        count: sales30._count._all,
        totalFcfa: Number(sales30._sum.totalAmount ?? 0),
      },
    };
  }

  // ---------------------------------------------------------------
  // Lapins
  // ---------------------------------------------------------------

  async searchRabbits(filters: {
    query?: string;
    sex?: 'MALE' | 'FEMALE' | 'UNKNOWN';
    status?: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED' | 'CULLED';
    purpose?: 'BREEDER' | 'FATTENING' | 'FUTURE_BREEDER' | 'REFORM';
    limit?: number;
  }) {
    const rabbits = await this.prisma.rabbit.findMany({
      where: {
        farmId: this.farmId,
        status: filters.status ?? RabbitStatus.ACTIVE,
        ...(filters.sex ? { sex: filters.sex } : {}),
        ...(filters.purpose ? { purpose: filters.purpose } : {}),
        ...(filters.query
          ? {
              OR: [
                { code: { contains: filters.query, mode: 'insensitive' } },
                { color: { contains: filters.query, mode: 'insensitive' } },
                { observations: { contains: filters.query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      take: Math.min(filters.limit ?? 30, 100),
      orderBy: { code: 'asc' },
      select: {
        code: true,
        sex: true,
        status: true,
        purpose: true,
        birthDate: true,
        color: true,
        breed: { select: { name: true } },
        cageMovements: {
          where: { endedAt: null },
          take: 1,
          select: { cage: { select: { code: true } } },
        },
      },
    });

    return rabbits.map((rabbit) => ({
      code: rabbit.code,
      sex: rabbit.sex,
      status: rabbit.status,
      purpose: rabbit.purpose,
      birthDate: day(rabbit.birthDate),
      ageDays: rabbit.birthDate ? Math.floor((this.now.getTime() - rabbit.birthDate.getTime()) / DAY) : null,
      breed: rabbit.breed?.name ?? null,
      color: rabbit.color,
      cage: rabbit.cageMovements[0]?.cage.code ?? null,
    }));
  }

  async rabbitDetails(code: string) {
    const ref = await this.findRabbit(code);
    if (!ref) return { error: `Aucun lapin « ${code} » dans cette ferme.` };

    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: ref.id, farmId: this.farmId },
      include: {
        breed: { select: { name: true } },
        father: { select: { code: true } },
        mother: { select: { code: true } },
        cageMovements: { where: { endedAt: null }, take: 1, include: { cage: { select: { code: true } } } },
        breedingsAsFemale: {
          orderBy: { breedingDate: 'desc' },
          take: 6,
          include: { male: { select: { code: true } }, birth: { select: { liveBorn: true, stillBorn: true, birthDate: true } } },
        },
        breedingsAsMale: {
          orderBy: { breedingDate: 'desc' },
          take: 6,
          include: { female: { select: { code: true } }, birth: { select: { liveBorn: true, stillBorn: true } } },
        },
        healthRecords: { orderBy: { date: 'desc' }, take: 5 },
        weighings: { orderBy: { date: 'desc' }, take: 3, select: { date: true, weight: true } },
      },
    });
    if (!rabbit) return { error: `Aucun lapin « ${code} » dans cette ferme.` };

    return {
      code: rabbit.code,
      sex: rabbit.sex,
      status: rabbit.status,
      purpose: rabbit.purpose,
      birthDate: day(rabbit.birthDate),
      breed: rabbit.breed?.name ?? null,
      father: rabbit.father?.code ?? null,
      mother: rabbit.mother?.code ?? null,
      cage: rabbit.cageMovements[0]?.cage.code ?? null,
      exit: rabbit.exitDate ? { date: day(rabbit.exitDate), cause: rabbit.exitCause } : null,
      breedingsAsFemale: rabbit.breedingsAsFemale.map((breeding) => ({
        date: day(breeding.breedingDate),
        male: breeding.male.code,
        status: breeding.status,
        expectedBirth: day(breeding.expectedBirthStartDate),
        birth: breeding.birth
          ? { date: day(breeding.birth.birthDate), liveBorn: breeding.birth.liveBorn, stillBorn: breeding.birth.stillBorn }
          : null,
      })),
      breedingsAsMale: rabbit.breedingsAsMale.map((breeding) => ({
        date: day(breeding.breedingDate),
        female: breeding.female.code,
        status: breeding.status,
        liveBorn: breeding.birth?.liveBorn ?? null,
      })),
      recentHealth: rabbit.healthRecords.map((record) => ({
        date: day(record.date),
        type: record.type,
        symptoms: record.symptoms,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        medication: record.medication,
        nextDueDate: day(record.nextDueDate),
      })),
      recentWeighings: rabbit.weighings.map((weighing) => ({ date: day(weighing.date), weightKg: Number(weighing.weight) })),
    };
  }

  // ---------------------------------------------------------------
  // Reproduction et portées
  // ---------------------------------------------------------------

  async breedings(filters: { status?: 'OPEN' | 'ALL'; femaleCode?: string; limit?: number }) {
    let femaleId: string | undefined;
    if (filters.femaleCode) {
      const female = await this.findRabbit(filters.femaleCode);
      if (!female) return { error: `Aucune femelle « ${filters.femaleCode} ».` };
      femaleId = female.id;
    }
    const rows = await this.prisma.breeding.findMany({
      where: {
        farmId: this.farmId,
        ...(filters.status === 'ALL' ? {} : { status: { in: OPEN_BREEDING } }),
        ...(femaleId ? { femaleId } : {}),
      },
      orderBy: { breedingDate: 'desc' },
      take: Math.min(filters.limit ?? 30, 100),
      include: { female: { select: { code: true } }, male: { select: { code: true } } },
    });
    return rows.map((breeding) => ({
      female: breeding.female.code,
      male: breeding.male.code,
      date: day(breeding.breedingDate),
      status: breeding.status,
      palpation: [day(breeding.palpationStartDate), day(breeding.palpationEndDate)],
      nest: day(breeding.nestDate),
      expectedBirth: [day(breeding.expectedBirthStartDate), day(breeding.expectedBirthEndDate)],
    }));
  }

  async litters(filters: { status?: 'ACTIVE' | 'WEANED' | 'CLOSED'; limit?: number }) {
    const rows = await this.prisma.litter.findMany({
      where: { farmId: this.farmId, ...(filters.status ? { status: filters.status } : {}) },
      orderBy: { birthDate: 'desc' },
      take: Math.min(filters.limit ?? 30, 100),
      include: { mother: { select: { code: true } }, father: { select: { code: true } } },
    });
    return rows.map((litter) => ({
      code: litter.code,
      mother: litter.mother.code,
      father: litter.father?.code ?? null,
      birthDate: day(litter.birthDate),
      ageDays: Math.floor((this.now.getTime() - litter.birthDate.getTime()) / DAY),
      liveBorn: litter.liveBorn,
      stillBorn: litter.stillBorn,
      currentCount: litter.currentCount,
      status: litter.status,
    }));
  }

  // ---------------------------------------------------------------
  // Tâches, santé, mortalité
  // ---------------------------------------------------------------

  async tasks(filters: { scope?: 'TODAY' | 'OVERDUE' | 'UPCOMING' | 'OPEN'; days?: number }) {
    const start = this.startOfToday();
    const end = new Date(start.getTime() + DAY);
    const horizon = new Date(start.getTime() + (filters.days ?? 7) * DAY);
    const dueDate =
      filters.scope === 'TODAY'
        ? { gte: start, lt: end }
        : filters.scope === 'OVERDUE'
          ? { lt: start }
          : filters.scope === 'UPCOMING'
            ? { gte: start, lt: horizon }
            : undefined;

    const rows = await this.prisma.task.findMany({
      where: { farmId: this.farmId, status: { in: OPEN_TASK }, ...(dueDate ? { dueDate } : {}) },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
      take: 50,
      include: { rabbit: { select: { code: true } } },
    });
    return rows.map((task) => ({
      title: task.title,
      dueDate: day(task.dueDate),
      priority: task.priority,
      status: task.status,
      rabbit: task.rabbit?.code ?? null,
      automatic: Boolean(task.automationKey),
    }));
  }

  async health(filters: { rabbitCode?: string; days?: number }) {
    let rabbitId: string | undefined;
    if (filters.rabbitCode) {
      const rabbit = await this.findRabbit(filters.rabbitCode);
      if (!rabbit) return { error: `Aucun lapin « ${filters.rabbitCode} ».` };
      rabbitId = rabbit.id;
    }
    const rows = await this.prisma.healthRecord.findMany({
      where: { farmId: this.farmId, date: { gte: this.since(filters.days ?? 30) }, ...(rabbitId ? { rabbitId } : {}) },
      orderBy: { date: 'desc' },
      take: 50,
      include: { rabbit: { select: { code: true } } },
    });
    return rows.map((record) => ({
      rabbit: record.rabbit.code,
      date: day(record.date),
      type: record.type,
      symptoms: record.symptoms,
      suspicion: record.suspicion,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      medication: record.medication,
      nextDueDate: day(record.nextDueDate),
    }));
  }

  async mortality(days = 30) {
    const rows = await this.prisma.mortalityRecord.findMany({
      where: { farmId: this.farmId, date: { gte: this.since(days) } },
      orderBy: { date: 'desc' },
      take: 100,
      include: {
        rabbit: { select: { code: true } },
        litter: { select: { code: true } },
        lot: { select: { code: true } },
      },
    });
    const byCause = new Map<string, number>();
    for (const row of rows) {
      const cause = row.cause?.trim() || 'non précisée';
      byCause.set(cause, (byCause.get(cause) ?? 0) + row.count);
    }
    return {
      days,
      total: rows.reduce((sum, row) => sum + row.count, 0),
      byCause: [...byCause.entries()].map(([cause, count]) => ({ cause, count })),
      records: rows.slice(0, 30).map((row) => ({
        date: day(row.date),
        scope: row.scope,
        target: row.rabbit?.code ?? row.litter?.code ?? row.lot?.code ?? null,
        count: row.count,
        cause: row.cause,
      })),
    };
  }

  // ---------------------------------------------------------------
  // Argent et stock
  // ---------------------------------------------------------------

  async finances(days = 30) {
    const since = this.since(days);
    const [sales, expenses] = await Promise.all([
      this.prisma.sale.findMany({
        where: { farmId: this.farmId, saleDate: { gte: since }, status: { not: 'CANCELLED' } },
        select: { totalAmount: true, status: true, payments: { select: { amount: true } } },
      }),
      this.prisma.expense.groupBy({
        by: ['category'],
        where: { farmId: this.farmId, date: { gte: since } },
        _sum: { amount: true },
      }),
    ]);
    const revenue = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
    const paid = sales.reduce(
      (sum, sale) => sum + sale.payments.reduce((total, payment) => total + Number(payment.amount), 0),
      0,
    );
    const expenseRows = expenses.map((row) => ({ category: row.category, totalFcfa: Number(row._sum.amount ?? 0) }));
    const totalExpenses = expenseRows.reduce((sum, row) => sum + row.totalFcfa, 0);
    return {
      days,
      currency: 'FCFA',
      sales: { count: sales.length, revenue, paid, remainingToCollect: revenue - paid },
      expenses: { total: totalExpenses, byCategory: expenseRows },
      margin: revenue - totalExpenses,
    };
  }

  async stock() {
    const items = await this.prisma.inventoryItem.findMany({
      where: { farmId: this.farmId },
      orderBy: { name: 'asc' },
      include: { movements: { where: { date: { gte: this.since(30) } }, select: { type: true, quantity: true, date: true } } },
    });
    return items.map((item) => {
      const autonomy = computeAutonomy(item.currentStock, item.movements, this.now);
      return {
        name: item.name,
        type: item.type,
        unit: item.unit,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        belowMinimum: item.minimumStock !== null && item.currentStock <= item.minimumStock,
        autonomyDays: autonomy.autonomyDays,
      };
    });
  }
}
