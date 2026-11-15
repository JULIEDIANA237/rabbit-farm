import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import type { CurrentUserType } from '../../auth/types/current-user.type.js';
import { RabbitStatus } from '../../generated/prisma/client.js';

import { evaluateReadiness, type ReadinessCriteria } from './sale-readiness.js';

const DAY = 86_400_000;

export interface SaleCandidate {
  rabbitId: string;
  code: string;
  sex: string;
  purpose: string;
  ageDays: number | null;
  weight: number | null;
  weightSource: string | null;
  weighedAt: Date | null;
  lotId: string | null;
  lotCode: string | null;
  cageCode: string | null;
  manual: boolean;
  reasons: string[];
}

@Injectable()
export class SaleReadinessService {
  constructor(private readonly prisma: PrismaService) {}

  async criteria(farmId: string): Promise<ReadinessCriteria> {
    const farm = await this.prisma.farm.findUniqueOrThrow({
      where: { id: farmId },
      select: { saleMinAgeDays: true, saleMinWeightKg: true },
    });
    return { minAgeDays: farm.saleMinAgeDays, minWeightKg: farm.saleMinWeightKg };
  }

  /** Lapins prêts (ou bientôt prêts) pour la vente, avec les raisons. */
  async list(farmId: string) {
    const criteria = await this.criteria(farmId);
    const rabbits = await this.prisma.rabbit.findMany({
      where: { farmId, status: RabbitStatus.ACTIVE },
      orderBy: { code: 'asc' },
      include: {
        weighings: { orderBy: { date: 'desc' }, take: 1 },
        lotMemberships: {
          where: { leftAt: null },
          take: 1,
          include: {
            lot: {
              select: {
                id: true,
                code: true,
                weighings: { orderBy: { date: 'desc' }, take: 1 },
              },
            },
          },
        },
        cageMovements: {
          where: { endedAt: null },
          take: 1,
          include: { cage: { select: { code: true } } },
        },
        // Lapereaux encore sous la mère : jamais proposés.
        birthLitter: { select: { status: true } },
      },
    });

    const now = Date.now();
    const ready: SaleCandidate[] = [];
    const soon: SaleCandidate[] = [];
    for (const rabbit of rabbits) {
      const membership = rabbit.lotMemberships[0];
      const ownWeighing = rabbit.weighings[0];
      const lotWeighing = membership?.lot.weighings[0];
      // Pesée la plus récente : individuelle, sinon moyenne du lot, sinon fiche.
      let weight: number | null = null;
      let weightSource: string | null = null;
      let weighedAt: Date | null = null;
      if (ownWeighing && (!lotWeighing || ownWeighing.date >= lotWeighing.date)) {
        weight = ownWeighing.averageWeight ?? ownWeighing.totalWeight;
        weightSource = 'Pesée individuelle';
        weighedAt = ownWeighing.date;
      } else if (lotWeighing) {
        weight = lotWeighing.averageWeight ?? lotWeighing.totalWeight / Math.max(lotWeighing.animalCount, 1);
        weightSource = `Moyenne du lot ${membership.lot.code}`;
        weighedAt = lotWeighing.date;
      } else if (rabbit.weight != null) {
        weight = Number(rabbit.weight);
        weightSource = 'Fiche du lapin';
      }
      weight = weight != null ? Math.round(weight * 100) / 100 : null;
      const ageDays = rabbit.birthDate ? Math.floor((now - rabbit.birthDate.getTime()) / DAY) : null;
      const nursing = rabbit.birthLitter?.status === 'ACTIVE' && (ageDays ?? 0) < 28;
      if (nursing && !rabbit.readyForSale) continue;

      const { state, reasons } = evaluateReadiness(
        { ageDays, weight, manual: rabbit.readyForSale, purpose: rabbit.purpose },
        criteria,
      );
      if (state === 'NOT_YET') continue;
      const row: SaleCandidate = {
        rabbitId: rabbit.id,
        code: rabbit.code,
        sex: rabbit.sex,
        purpose: rabbit.purpose,
        ageDays,
        weight,
        weightSource,
        weighedAt,
        lotId: membership?.lot.id ?? null,
        lotCode: membership?.lot.code ?? null,
        cageCode: rabbit.cageMovements[0]?.cage.code ?? null,
        manual: rabbit.readyForSale,
        reasons,
      };
      (state === 'READY' ? ready : soon).push(row);
    }
    return { criteria, ready, soon };
  }

  async readyCount(farmId: string) {
    return (await this.list(farmId)).ready.length;
  }

  async setManual(rabbitIds: string[], ready: boolean, currentUser: CurrentUserType) {
    if (!rabbitIds.length) return 0;
    const result = await this.prisma.rabbit.updateMany({
      where: { id: { in: rabbitIds }, farmId: currentUser.farmId, status: RabbitStatus.ACTIVE },
      data: { readyForSale: ready, readyForSaleAt: ready ? new Date() : null },
    });
    return result.count;
  }

  async updateCriteria(minAgeDays: number, minWeightKg: number, currentUser: CurrentUserType) {
    if (!Number.isInteger(minAgeDays) || minAgeDays < 30 || minAgeDays > 720) {
      throw new BadRequestException('L’âge de vente doit être compris entre 30 et 720 jours.');
    }
    if (!(minWeightKg > 0) || minWeightKg > 10) {
      throw new BadRequestException('Le poids de vente doit être compris entre 0 et 10 kg.');
    }
    await this.prisma.farm.update({
      where: { id: currentUser.farmId },
      data: { saleMinAgeDays: minAgeDays, saleMinWeightKg: minWeightKg },
    });
    return this.criteria(currentUser.farmId);
  }
}
