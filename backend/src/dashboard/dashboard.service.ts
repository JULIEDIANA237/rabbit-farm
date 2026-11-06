import { Injectable } from '@nestjs/common';

import {
  BreedingStatus,
  CageStatus,
  SaleStatus,
  StockMovementType,
  RabbitSex,
  RabbitStatus,
  TaskPriority,
  TaskSourceType,
  TaskStatus,
  type Prisma,
} from '../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { computeAutonomy } from '../operations/automation/stock-autonomy';

import type { CurrentUserType } from '../auth/types/current-user.type';

/**
 * Naissance telle que retournée par Prisma avec
 * l'accouplement et la femelle associés.
 */
type BirthWithBreeding = Prisma.BirthGetPayload<{
  include: {
    breeding: {
      include: {
        female: true;
      };
    };
  };
}>;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(currentUser: CurrentUserType) {
    const farmId = currentUser.farmId;

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfTomorrow = new Date(endOfToday);
    startOfTomorrow.setMilliseconds(1);

    const next7Days = new Date(startOfToday);
    next7Days.setDate(next7Days.getDate() + 7);
    next7Days.setHours(23, 59, 59, 999);

    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
    );

    // Jeunes lapins : 35 jours ou moins
    const youngRabbitLimit = new Date(now);
    youngRabbitLimit.setDate(youngRabbitLimit.getDate() - 35);

    const [
      totalRabbits,
      activeRabbits,
      breedingMales,
      breedingFemales,
      youngRabbits,

      overdueTasks,
      tasksToday,
      urgentTasks,

      femalesToPalpate,
      nestsToInstall,

      expectedBirthList,
      recentBirthList,

      weaningList,

      lowStockList,

      birthsThisMonthData,
      monthlyExpensesData,

      breedingCompleted,
      breedingSuccessful,

      healthActions,
      totalCages,
      occupiedCageRows,
      monthlySalesData,
    ] = await Promise.all([
      // =========================
      // POPULATION
      // =========================

      this.prisma.rabbit.count({
        where: {
          farmId,
        },
      }),

      this.prisma.rabbit.count({
        where: {
          farmId,
          status: RabbitStatus.ACTIVE,
        },
      }),

      this.prisma.rabbit.count({
        where: {
          farmId,
          status: RabbitStatus.ACTIVE,
          sex: RabbitSex.MALE,
        },
      }),

      this.prisma.rabbit.count({
        where: {
          farmId,
          status: RabbitStatus.ACTIVE,
          sex: RabbitSex.FEMALE,
        },
      }),

      this.prisma.rabbit.count({
        where: {
          farmId,
          status: RabbitStatus.ACTIVE,
          birthDate: {
            gte: youngRabbitLimit,
          },
        },
      }),

      // =========================
      // TASKS
      // =========================

      this.prisma.task.count({
        where: {
          farmId,
          status: {
            in: [
              TaskStatus.TODO,
              TaskStatus.IN_PROGRESS,
            ],
          },
          dueDate: {
            lt: startOfToday,
          },
        },
      }),

      this.prisma.task.count({
        where: {
          farmId,
          status: {
            in: [
              TaskStatus.TODO,
              TaskStatus.IN_PROGRESS,
            ],
          },
          dueDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      this.prisma.task.count({
        where: {
          farmId,
          status: {
            in: [
              TaskStatus.TODO,
              TaskStatus.IN_PROGRESS,
            ],
          },
          priority: TaskPriority.URGENT,
        },
      }),

      // =========================
      // PALPATIONS
      // =========================

      this.prisma.breeding.findMany({
        where: {
          farmId,
          status: BreedingStatus.AWAITING_PALPATION,
          palpationStartDate: {
            lte: endOfToday,
          },
        },
        include: {
          female: true,
        },
        orderBy: {
          palpationStartDate: 'asc',
        },
      }),

      // =========================
      // NIDS
      // =========================

      this.prisma.breeding.findMany({
        where: {
          farmId,
          status: BreedingStatus.PREGNANT,
          nestDate: {
            lte: next7Days,
          },
          birth: {
            is: null,
          },
        },
        include: {
          female: true,
        },
        orderBy: {
          nestDate: 'asc',
        },
      }),

      // =========================
      // NAISSANCES À VENIR (femelles gestantes)
      // =========================

      this.prisma.breeding.findMany({
        where: {
          farmId,
          status: BreedingStatus.PREGNANT,
          birth: { is: null },
          expectedBirthStartDate: {
            lte: next7Days,
          },
        },
        include: {
          female: true,
        },
        orderBy: {
          expectedBirthStartDate: 'asc',
        },
      }),

      // =========================
      // NAISSANCES RÉCENTES
      // =========================

      this.prisma.birth.findMany({
        where: {
          farmId,
          birthDate: {
            gte: sevenDaysAgo,
            lte: endOfToday,
          },
        },
        include: {
          breeding: {
            include: {
              female: true,
            },
          },
        },
        orderBy: {
          birthDate: 'desc',
        },
      }),

      // =========================
      // SEVRAGES
      // =========================

      this.prisma.weaning.findMany({
        where: {
          farmId,
          actualDate: null,
          plannedDate: {
            lte: next7Days,
          },
        },
        include: {
          litter: { select: { code: true } },
        },
        orderBy: {
          plannedDate: 'asc',
        },
      }),

      // =========================
      // STOCK FAIBLE
      // =========================

      this.prisma.inventoryItem.findMany({
        where: {
          farmId,
          minimumStock: {
            not: null,
          },
        },

        /**
         * Seuls les champs nécessaires aux alertes
         * sont chargés (évite de typer la description,
         * l'unité, etc. inutilement).
         */
        select: {
          id: true,
          name: true,
          unit: true,
          currentStock: true,
          minimumStock: true,
          movements: {
            where: { type: StockMovementType.CONSUMPTION },
            select: { type: true, quantity: true, date: true },
          },
        },

        orderBy: {
          name: 'asc',
        },
      }),

      // =========================
      // NAISSANCES DU MOIS
      // =========================

      this.prisma.birth.findMany({
        where: {
          farmId,
          birthDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        select: {
          liveBorn: true,
          stillBorn: true,
        },
      }),

      // =========================
      // DÉPENSES DU MOIS
      // =========================

      this.prisma.expense.aggregate({
        where: {
          farmId,
          date: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // =========================
      // REPRODUCTIONS TERMINÉES
      // =========================

      this.prisma.breeding.count({
        where: {
          farmId,
          status: {
            in: [
              BreedingStatus.PREGNANT,
              BreedingStatus.NON_PREGNANT,
              BreedingStatus.INCONCLUSIVE,
              BreedingStatus.BIRTH_RECORDED,
            ],
        },
      },
      }),

      // =========================
      // REPRODUCTIONS RÉUSSIES
      // =========================

      this.prisma.breeding.count({
        where: {
          farmId,
          status: {
            in: [
              BreedingStatus.PREGNANT,
              BreedingStatus.BIRTH_RECORDED,
            ],
          },
        },
      }),

      // =========================
      // SOINS ET VACCINS À FAIRE
      // =========================

      this.prisma.healthRecord.findMany({
        where: {
          farmId,
          nextDueDate: { gte: thirtyDaysAgo, lte: next7Days },
          rabbit: { status: RabbitStatus.ACTIVE },
        },
        include: { rabbit: { select: { code: true } } },
        orderBy: { nextDueDate: 'asc' },
        take: 20,
      }),

      // =========================
      // CAGES
      // =========================

      this.prisma.cage.count({
        where: { farmId, status: CageStatus.ACTIVE },
      }),

      this.prisma.rabbitCageMovement.findMany({
        where: {
          endedAt: null,
          cage: { farmId },
          rabbit: { status: RabbitStatus.ACTIVE },
        },
        distinct: ['cageId'],
        select: { cageId: true },
      }),

      // =========================
      // VENTES DU MOIS
      // =========================

      this.prisma.sale.aggregate({
        where: {
          farmId,
          status: { not: SaleStatus.CANCELLED },
          saleDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    // =========================
    // TÂCHES URGENTES
    // =========================

    const urgentTaskList = await this.prisma.task.findMany({
      where: {
        farmId,
        status: {
          in: [
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
          ],
        },
        OR: [
          {
            priority: TaskPriority.URGENT,
          },
          {
            dueDate: {
              lt: startOfToday,
            },
          },
        ],
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          dueDate: 'asc',
        },
      ],
      take: 10,
    });

    // =========================
    // STOCK FAIBLE
    // =========================

    const filteredLowStock = lowStockList
      .map((item) => ({
        ...item,
        autonomy: computeAutonomy(item.currentStock, item.movements, now),
      }))
      .filter(
        (item) =>
          (item.minimumStock != null &&
            item.currentStock <= item.minimumStock) ||
          (item.autonomy.autonomyDays != null &&
            item.autonomy.autonomyDays <= 7),
      );

    // =========================
    // NAISSANCES DU MOIS
    // =========================

    const birthsThisMonth = birthsThisMonthData.length;

    const kitsBornThisMonth = birthsThisMonthData.reduce(
      (sum, birth) => sum + birth.liveBorn,
      0,
    );

    const averageLitterSize =
      birthsThisMonth > 0
        ? kitsBornThisMonth / birthsThisMonth
        : null;

    // =========================
    // TAUX DE RÉUSSITE REPRODUCTION
    // =========================

    const breedingSuccessRate =
      breedingCompleted > 0
        ? (breedingSuccessful / breedingCompleted) * 100
        : null;

    // =========================
    // MAPPING
    // =========================

    const palpationList = femalesToPalpate.map((breeding) => ({
      id: breeding.id,
      femaleId: breeding.femaleId,
      femaleCode: breeding.female.code,
      breedingDate: breeding.breedingDate,
      palpationStartDate: breeding.palpationStartDate,
      palpationEndDate: breeding.palpationEndDate,
      nestDate: breeding.nestDate,
      expectedBirthStartDate:
        breeding.expectedBirthStartDate,
      expectedBirthEndDate:
        breeding.expectedBirthEndDate,
    }));

    const nestInstallationList = nestsToInstall.map(
      (breeding) => ({
        id: breeding.id,
        femaleId: breeding.femaleId,
        femaleCode: breeding.female.code,
        breedingDate: breeding.breedingDate,
        palpationStartDate:
          breeding.palpationStartDate,
        palpationEndDate:
          breeding.palpationEndDate,
        nestDate: breeding.nestDate,
        expectedBirthStartDate:
          breeding.expectedBirthStartDate,
        expectedBirthEndDate:
          breeding.expectedBirthEndDate,
      }),
    );

    const mapBirth = (
      birth: BirthWithBreeding,
    ) => ({
      id: birth.id,
      breedingId: birth.breedingId,
      femaleId: birth.breeding.female.id,
      femaleCode: birth.breeding.female.code,
      birthDate: birth.birthDate,
      liveBorn: birth.liveBorn,
      stillBorn: birth.stillBorn,
      totalBorn: birth.liveBorn + birth.stillBorn,
    });

    const expectedBirths = expectedBirthList.map((breeding) => ({
      id: breeding.id,
      femaleId: breeding.femaleId,
      femaleCode: breeding.female.code,
      breedingDate: breeding.breedingDate,
      palpationStartDate: breeding.palpationStartDate,
      palpationEndDate: breeding.palpationEndDate,
      nestDate: breeding.nestDate,
      expectedBirthStartDate: breeding.expectedBirthStartDate,
      expectedBirthEndDate: breeding.expectedBirthEndDate,
    }));
    const recentBirths = recentBirthList.map(mapBirth);

    const weanings = weaningList.map((weaning) => ({
      id: weaning.id,
      litterId: weaning.litterId,
      litterCode: weaning.litter.code,
      plannedDate: weaning.plannedDate,
      quantity: weaning.quantity,
      averageWeight:
        weaning.averageWeight != null
          ? Number(weaning.averageWeight)
          : null,
    }));

    const stockAlerts = filteredLowStock.map((item) => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      autonomyDays: item.autonomy.autonomyDays,
    }));

    // Un soin dont la tâche de suivi est close n'est plus à faire.
    const closedFollowUps = healthActions.length
      ? await this.prisma.task.findMany({
          where: {
            farmId,
            sourceType: TaskSourceType.HEALTH,
            sourceId: { in: healthActions.map((record) => record.id) },
            status: { in: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
          },
          select: { sourceId: true },
        })
      : [];
    const closedIds = new Set(closedFollowUps.map((task) => task.sourceId));

    const healthActionList = healthActions
      .filter((record) => !closedIds.has(record.id))
      .map((record) => ({
      id: record.id,
      rabbitId: record.rabbitId,
      rabbitCode: record.rabbit.code,
      type: record.type,
      dueDate: record.nextDueDate as Date,
      label:
        record.medication || record.treatment || record.diagnosis || record.type,
      overdue: (record.nextDueDate as Date) < startOfToday,
    }));

    return {
      date: now,

      // Population
      totalRabbits,
      activeRabbits,
      breedingMales,
      breedingFemales,
      youngRabbits,

      // Actions
      overdueTasks,
      tasksToday,
      urgentTasks,
      femalesToPalpate: palpationList.length,
      nestsToInstall: nestInstallationList.length,
      expectedBirths: expectedBirths.length,
      recentBirths: recentBirths.length,
      plannedWeanings: weanings.length,
      lowStockItems: stockAlerts.length,
      healthActions: healthActionList.length,

      // Cages
      totalCages,
      occupiedCages: occupiedCageRows.length,

      // Technique
      birthsThisMonth,
      kitsBornThisMonth,
      averageLitterSize,
      breedingSuccessRate,

      // Finance
      monthlyExpenses:
        monthlyExpensesData._sum.amount != null
          ? Number(monthlyExpensesData._sum.amount)
          : 0,
      monthlyRevenue:
        monthlySalesData._sum.totalAmount != null
          ? Number(monthlySalesData._sum.totalAmount)
          : 0,

      // Details
      urgentTaskList,
      palpationList,
      nestInstallationList,
      expectedBirthList: expectedBirths,
      recentBirthList: recentBirths,
      weaningList: weanings,
      lowStockList: stockAlerts,
      healthActionList,
    };
  }
}