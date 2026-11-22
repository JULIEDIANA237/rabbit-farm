import { Injectable } from '@nestjs/common';

import { BreedingStatus, LitterStatus, RabbitSex, RabbitStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FeedingService } from '../operations/feeding/feeding.service.js';
import { ACTIVE_BREEDING_STATUSES } from '../breeding/breeding.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { buildSuggestions, type AdvisorFacts } from './suggestions.js';

const DAY = 86_400_000;
const days = (from: Date, to: Date) => Math.floor((to.getTime() - from.getTime()) / DAY);
const isMaternity = (c: { type: string | null; section: { type: string } }) => c.type === 'Maternité' || (!c.type && c.section.type === 'MATERNITY');
const isFattening = (c: { type: string | null; section: { type: string } }) => c.type === 'Engraissement' || (!c.type && c.section.type === 'FATTENING');

@Injectable()
export class AdvisorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly feeding: FeedingService,
  ) {}

  async suggestions(user: CurrentUserType, now = new Date()) {
    return buildSuggestions(await this.facts(user, now));
  }

  private async facts(user: CurrentUserType, now: Date): Promise<AdvisorFacts> {
    const farmId = user.farmId;
    const in7 = new Date(now.getTime() + 7 * DAY);
    const ago24h = new Date(now.getTime() - DAY);
    const ago7d = new Date(now.getTime() - 7 * DAY);

    const [breeders, activeBreedings, males, cages, litters, lots, plan] = await Promise.all([
      this.prisma.rabbit.findMany({
        where: { farmId, status: RabbitStatus.ACTIVE, purpose: { in: ['BREEDER', 'FUTURE_BREEDER'] } },
        select: {
          id: true, code: true, sex: true, purpose: true, birthDate: true,
          previousLitters: true, previousMatings: true, previousFemales: true,
          motherBirths: { select: { birthDate: true }, orderBy: { birthDate: 'desc' }, take: 1 },
          breedingsAsFemale: {
            select: { status: true, updatedAt: true },
            orderBy: { breedingDate: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.breeding.findMany({
        where: { farmId, status: { in: ACTIVE_BREEDING_STATUSES } },
        select: { femaleId: true, expectedBirthStartDate: true, expectedBirthEndDate: true, female: { select: { code: true } }, nestInstallation: { select: { id: true } } },
      }),
      this.prisma.rabbit.findMany({
        where: { farmId, status: RabbitStatus.ACTIVE, sex: RabbitSex.MALE, purpose: 'BREEDER' },
        select: {
          id: true, code: true,
          breedingsAsMale: { where: { breedingDate: { gte: ago7d }, status: { not: BreedingStatus.CANCELLED } }, select: { femaleId: true, breedingDate: true } },
          extraMatings: { where: { date: { gte: ago7d } }, select: { date: true, breeding: { select: { femaleId: true } } } },
        },
      }),
      this.prisma.cage.findMany({
        where: { farmId, status: 'ACTIVE' },
        select: { type: true, capacity: true, section: { select: { type: true } }, _count: { select: { rabbitMovements: { where: { endedAt: null } } } } },
      }),
      this.prisma.litter.findMany({ where: { farmId, status: LitterStatus.ACTIVE }, select: { code: true, birthDate: true, currentCount: true } }),
      this.prisma.fatteningLot.findMany({
        where: { farmId, status: 'ACTIVE' },
        select: {
          id: true, code: true, entryDate: true,
          _count: { select: { memberships: { where: { leftAt: null } } } },
          weighings: { orderBy: { date: 'desc' }, take: 1, select: { date: true, averageWeight: true } },
        },
      }),
      this.feeding.plan(user, now).catch(() => ({ items: [] as Array<{ name: string; unit: string; autonomyDays: number | null; dailyNeed: number }> })),
    ]);

    const busy = new Set(activeBreedings.map((b) => b.femaleId));
    const females = breeders.filter((r) => r.sex === RabbitSex.FEMALE && r.purpose === 'BREEDER' && !busy.has(r.id));

    const free = (pred: (c: (typeof cages)[number]) => boolean) =>
      cages.filter(pred).reduce((s, c) => s + Math.max(0, c.capacity - c._count.rabbitMovements), 0);

    return {
      now,
      availableFemales: females.map((f) => ({
        id: f.id,
        code: f.code,
        ageDays: f.birthDate ? days(f.birthDate, now) : null,
        daysSinceBirth: f.motherBirths[0] ? days(f.motherBirths[0].birthDate, now) : null,
        lastPalpationNegative: f.breedingsAsFemale[0]?.status === BreedingStatus.NON_PREGNANT,
      })),
      males: males.map((m) => {
        const last24 = new Set([
          ...m.breedingsAsMale.filter((b) => b.breedingDate > ago24h).map((b) => b.femaleId),
          ...m.extraMatings.filter((x) => x.date > ago24h).map((x) => x.breeding.femaleId),
        ]);
        return { id: m.id, code: m.code, femalesLast24h: last24.size, matingsLast7d: m.breedingsAsMale.length + m.extraMatings.length };
      }),
      birthsNext7Days: activeBreedings
        .flatMap((b) => {
          const start = b.expectedBirthStartDate, end = b.expectedBirthEndDate;
          if (!start || !end || start > in7 || end < new Date(now.getTime() - 2 * DAY)) return [];
          return [{ femaleCode: b.female.code, start, end, nestInstalled: Boolean(b.nestInstallation) }];
        }),
      freeMaternityCages: cages.filter((c) => isMaternity(c) && c._count.rabbitMovements === 0).length,
      litters: litters.map((l) => ({ code: l.code, ageDays: days(l.birthDate, now), count: l.currentCount })),
      freeFatteningPlaces: free(isFattening),
      lots: lots.map((l) => ({
        id: l.id,
        code: l.code,
        ageDays: days(l.entryDate, now),
        members: l._count.memberships,
        lastWeighingDays: l.weighings[0] ? days(l.weighings[0].date, now) : null,
        averageWeight: l.weighings[0]?.averageWeight ?? null,
      })),
      feeds: plan.items.map((i) => ({ name: i.name, unit: i.unit, autonomyDays: i.autonomyDays, dailyNeed: i.dailyNeed })),
      breedersWithoutPast: breeders.filter((r) =>
        r.sex === RabbitSex.FEMALE ? r.previousLitters == null : r.previousMatings == null && r.previousFemales == null,
      ).length,
    };
  }
}
