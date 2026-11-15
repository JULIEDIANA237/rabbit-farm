import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import type { CurrentUserType } from '../../auth/types/current-user.type.js';
import type { SheetEventModel, SheetWeighingModel, TrackingSheetModel } from './tracking-sheet.model.js';

const DAY = 86_400_000;
const days = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / DAY);
const byDate = (a: SheetEventModel, b: SheetEventModel) => a.date.getTime() - b.date.getTime();

/** Gain moyen quotidien entre deux pesées, en grammes par jour. */
export function dailyGainGrams(
  previous: { date: Date; averageWeight: number | null },
  current: { date: Date; averageWeight: number | null },
) {
  const d = days(previous.date, current.date);
  if (d <= 0 || previous.averageWeight == null || current.averageWeight == null) return null;
  return Math.round(((current.averageWeight - previous.averageWeight) * 1000) / d);
}

/**
 * Fiche de suivi d'un lot d'engraissement : pour chaque portée d'origine,
 * saillie → palpation → nid → mise bas → sevrage, puis la vie du lot
 * (pesées et GMQ, mortalités, déplacements, ventes).
 */
@Injectable()
export class TrackingSheetService {
  constructor(private readonly prisma: PrismaService) {}

  async forLot(lotId: string, currentUser: CurrentUserType): Promise<TrackingSheetModel> {
    const lot = await this.prisma.fatteningLot.findFirst({
      where: { id: lotId, farmId: currentUser.farmId },
      include: {
        memberships: { include: { rabbit: { select: { birthLitterId: true } } } },
        weighings: { orderBy: { date: 'asc' } },
        mortalities: { orderBy: { date: 'asc' } },
        cageMovements: { include: { cage: { select: { code: true } } }, orderBy: { startedAt: 'asc' } },
        saleItems: { include: { sale: { select: { saleDate: true, status: true } } } },
      },
    });
    if (!lot) throw new NotFoundException('Lot introuvable.');

    const litterIds = [...new Set(lot.memberships.map((m) => m.rabbit.birthLitterId).filter((id): id is string => !!id))];
    const litters = await this.prisma.litter.findMany({
      where: { id: { in: litterIds }, farmId: currentUser.farmId },
      include: {
        mother: { select: { code: true } },
        father: { select: { code: true } },
        breeding: { include: { pregnancies: { orderBy: { checkDate: 'asc' } }, nestInstallation: true } },
        weanings: { where: { actualDate: { not: null } }, orderBy: { actualDate: 'asc' } },
        mortalities: { orderBy: { date: 'asc' } },
        sourceAdoptions: true,
        destinationAdoptions: true,
      },
      orderBy: { birthDate: 'asc' },
    });

    const sheetLitters = litters.map((litter) => {
      const breeding = litter.breeding;
      const confirmed = breeding?.pregnancies.find((p) => p.result === 'PREGNANT');
      const firstWeaning = litter.weanings[0];
      const weaned = litter.weanings.reduce((sum, w) => sum + w.quantity, 0);
      const deathsBeforeWeaning = litter.mortalities
        .filter((m) => !firstWeaning?.actualDate || m.date <= firstWeaning.actualDate)
        .reduce((sum, m) => sum + m.count, 0);

      const events: SheetEventModel[] = [];
      if (breeding) {
        events.push({ date: breeding.breedingDate, label: `Saillie de ${litter.mother.code} par ${litter.father?.code ?? '?'}` });
        for (const p of breeding.pregnancies) {
          const result = p.result === 'PREGNANT' ? 'positive' : p.result === 'NOT_PREGNANT' ? 'négative' : 'douteuse';
          events.push({ date: p.checkDate, label: `Palpation ${result}` });
        }
        if (breeding.nestInstallation) events.push({ date: breeding.nestInstallation.installedAt, label: 'Pose du nid' });
      }
      events.push({
        date: litter.birthDate,
        label: `Mise bas : ${litter.liveBorn} vivant(s)${litter.stillBorn ? `, ${litter.stillBorn} mort(s)-né(s)` : ''}`,
      });
      for (const a of litter.sourceAdoptions) events.push({ date: a.adoptedAt, label: `${a.quantity} lapereau(x) confié(s) à une autre mère` });
      for (const a of litter.destinationAdoptions) events.push({ date: a.adoptedAt, label: `${a.quantity} lapereau(x) adopté(s)` });
      for (const m of litter.mortalities) events.push({ date: m.date, label: `${m.count} mort(s)${m.cause ? ` : ${m.cause}` : ''}` });
      for (const w of litter.weanings) {
        const avg = w.averageWeight != null ? `, ${String(Number(w.averageWeight)).replace(".", ",")} kg en moyenne` : '';
        events.push({ date: w.actualDate!, label: `Sevrage de ${w.quantity} lapereau(x)${avg}` });
      }

      return {
        id: litter.id,
        code: litter.code,
        motherCode: litter.mother.code,
        fatherCode: litter.father?.code,
        breedingDate: breeding?.breedingDate ?? null,
        pregnancyConfirmedDate: confirmed?.checkDate ?? null,
        nestDate: breeding?.nestInstallation?.installedAt ?? breeding?.nestDate ?? null,
        birthDate: litter.birthDate,
        gestationDays: breeding ? days(breeding.breedingDate, litter.birthDate) : null,
        liveBorn: litter.liveBorn,
        stillBorn: litter.stillBorn,
        weaningDate: firstWeaning?.actualDate ?? null,
        weaningAgeDays: firstWeaning?.actualDate ? days(litter.birthDate, firstWeaning.actualDate) : null,
        weaned,
        weaningAverageWeight: firstWeaning?.averageWeight != null ? Number(firstWeaning.averageWeight) : null,
        deathsBeforeWeaning,
        events: events.sort(byDate),
      };
    });

    const weighings: SheetWeighingModel[] = lot.weighings.map((w, i) => {
      const average = w.averageWeight ?? (w.animalCount ? w.totalWeight / w.animalCount : null);
      const prev = lot.weighings[i - 1];
      const prevAverage = prev ? (prev.averageWeight ?? (prev.animalCount ? prev.totalWeight / prev.animalCount : null)) : null;
      return {
        date: w.date,
        animalCount: w.animalCount,
        totalWeight: w.totalWeight,
        averageWeight: average,
        ageInDays: w.ageInDays,
        dailyGainGrams: prev ? dailyGainGrams({ date: prev.date, averageWeight: prevAverage }, { date: w.date, averageWeight: average }) : null,
      };
    });

    const sales = lot.saleItems.filter((i) => i.sale.status !== 'CANCELLED');
    const lotEvents: SheetEventModel[] = [
      { date: lot.entryDate, label: `Entrée en engraissement (${lot.memberships.length} lapin(s))` },
      ...lot.cageMovements.map((m) => ({ date: m.startedAt, label: `Installé en cage ${m.cage.code}` })),
      ...lot.mortalities.map((m) => ({ date: m.date, label: `${m.count} mort(s)${m.cause ? ` : ${m.cause}` : ''}` })),
      ...sales.map((s) => ({
        date: s.sale.saleDate,
        label: `Vente : ${s.quantity} lapin(s)${s.weightKg ? `, ${s.weightKg} kg` : ''}, ${Number(s.totalPrice)} FCFA`,
      })),
      ...(lot.exitDate ? [{ date: lot.exitDate, label: 'Fin du lot' }] : []),
    ].sort(byDate);

    const first = weighings[0];
    const last = weighings[weighings.length - 1];
    const currentCage = lot.cageMovements.find((m) => !m.endedAt);

    return {
      lotId: lot.id,
      lotCode: lot.code,
      lotStatus: lot.status,
      entryDate: lot.entryDate,
      exitDate: lot.exitDate,
      currentCageCode: currentCage?.cage.code,
      enteredCount: lot.memberships.length,
      activeCount: lot.memberships.filter((m) => !m.leftAt).length,
      deadInLot: lot.mortalities.reduce((sum, m) => sum + m.count, 0),
      soldCount: sales.reduce((sum, s) => sum + s.quantity, 0),
      soldWeight: sales.some((s) => s.weightKg) ? sales.reduce((sum, s) => sum + (s.weightKg ?? 0), 0) : null,
      salesAmount: sales.length ? sales.reduce((sum, s) => sum + Number(s.totalPrice), 0) : null,
      litters: sheetLitters,
      weighings,
      lotEvents,
      overallDailyGainGrams:
        first && last && first !== last
          ? dailyGainGrams({ date: first.date, averageWeight: first.averageWeight ?? null }, { date: last.date, averageWeight: last.averageWeight ?? null })
          : null,
    };
  }
}
