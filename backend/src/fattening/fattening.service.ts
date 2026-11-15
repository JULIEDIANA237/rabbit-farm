import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  FatteningLotStatus,
  RabbitStatus,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CreateFatteningLotInput } from './inputs/create-fattening-lot.input.js';
import { AddLotMembersInput } from './inputs/add-lot-members.input.js';
import { RemoveLotMembersInput } from './inputs/remove-lot-members.input.js';
import { CompleteFatteningLotInput } from './inputs/complete-fattening-lot.input.js';
import { CreateWeighingInput } from './inputs/create-weighing.input.js';
import { MoveFatteningLotInput } from './inputs/move-fattening-lot.input.js';
import { UpdateFatteningLotInput } from './inputs/update-fattening-lot.input.js';
import { UpdateWeighingInput } from './inputs/update-weighing.input.js';
import { normalizeMovementReason } from '../common/constants/movement-reasons.js';

const lotInclude = {
  memberships: { where: { leftAt: null }, select: { id: true } },
  cageMovements: {
    where: { endedAt: null },
    include: { cage: { select: { id: true, code: true } } },
    take: 1,
  },
  weighings: { orderBy: { date: 'desc' as const }, take: 1 },
} as const;

type LotWithRelations = {
  memberships?: Array<{ id: string }>;
  cageMovements?: Array<{ cage: { id: string; code: string } }>;
  weighings?: Array<{ averageWeight: number | null; date: Date }>;
  [key: string]: unknown;
};

@Injectable()
export class FatteningService {
  constructor(private readonly prisma: PrismaService) {}

  private toLotModel<T extends LotWithRelations>(lot: T) {
    const { memberships, cageMovements, weighings, ...rest } = lot;
    const cage = cageMovements?.[0]?.cage ?? null;
    const latest = weighings?.[0] ?? null;

    return {
      ...rest,
      activeMemberCount: memberships?.length ?? 0,
      currentCageId: cage?.id ?? null,
      currentCageCode: cage?.code ?? null,
      latestAverageWeight: latest?.averageWeight ?? null,
      latestWeighingDate: latest?.date ?? null,
    };
  }

  /** Date saisie (passée possible) ou maintenant. */
  private operationDate(value?: Date) {
    if (!value) return new Date();
    const date = new Date(value);
    this.validateDate(date, 'de l’opération');
    return date;
  }

  private validateDate(date: Date, fieldName: string) {
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`La date ${fieldName} est invalide.`);
    }
  }

  /** Prochain code libre : LOT-01, LOT-02… */
  private async nextLotCode(farmId: string) {
    const lots = await this.prisma.fatteningLot.findMany({ where: { farmId }, select: { code: true } });
    const max = lots.reduce((m, l) => {
      const match = /^LOT-(\d+)$/.exec(l.code);
      return match ? Math.max(m, Number(match[1])) : m;
    }, 0);
    return `LOT-${String(max + 1).padStart(2, '0')}`;
  }

  async createLot(input: CreateFatteningLotInput, currentUser: CurrentUserType) {
    const code = input.code?.trim().toUpperCase() || (await this.nextLotCode(currentUser.farmId));
    const entryDate = new Date(input.entryDate);

    this.validateDate(entryDate, "d'entrée");

    const existing = await this.prisma.fatteningLot.findUnique({
      where: {
        farmId_code: {
          farmId: currentUser.farmId,
          code,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ce lot existe déjà.');
    }

    const lot = await this.prisma.fatteningLot.create({
      data: {
        farmId: currentUser.farmId,
        code,
        entryDate,
        observation: input.observation?.trim() || null,
      },
      include: lotInclude,
    });

    return this.toLotModel(lot);
  }

  async findLots(currentUser: CurrentUserType) {
    const lots = await this.prisma.fatteningLot.findMany({
      where: { farmId: currentUser.farmId },
      include: lotInclude,
      orderBy: { entryDate: 'desc' },
    });

    return lots.map((lot) => this.toLotModel(lot));
  }

  async findLot(id: string, currentUser: CurrentUserType) {
    const lot = await this.prisma.fatteningLot.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: lotInclude,
    });
    if (!lot) {
      throw new NotFoundException('Lot introuvable.');
    }
    return this.toLotModel(lot);
  }

  async addMembers(input: AddLotMembersInput, currentUser: CurrentUserType) {
    const rabbitIds = [...new Set(input.rabbitIds)];

    if (!rabbitIds.length) {
      throw new BadRequestException('Au moins un lapin doit être sélectionné.');
    }

    const lot = await this.prisma.fatteningLot.findFirst({
      where: { id: input.lotId, farmId: currentUser.farmId },
    });

    if (!lot) {
      throw new NotFoundException('Lot introuvable.');
    }

    if (lot.status !== FatteningLotStatus.ACTIVE) {
      throw new BadRequestException('Le lot n’est plus actif.');
    }

    const rabbits = await this.prisma.rabbit.findMany({
      where: {
        id: { in: rabbitIds },
        farmId: currentUser.farmId,
        status: RabbitStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (rabbits.length !== rabbitIds.length) {
      throw new BadRequestException(
        'Un ou plusieurs lapins sont introuvables ou inactifs.',
      );
    }

    const activeMemberships = await this.prisma.lotMembership.findMany({
      where: {
        rabbitId: { in: rabbitIds },
        leftAt: null,
      },
      select: { rabbitId: true },
    });

    if (activeMemberships.length) {
      throw new ConflictException(
        'Un lapin sélectionné appartient déjà à un lot actif.',
      );
    }

    return this.prisma.$transaction(
      rabbitIds.map((rabbitId) =>
        this.prisma.lotMembership.create({
          data: {
            lotId: lot.id,
            rabbitId,
            joinedAt: this.operationDate(input.date),
            reason: input.reason?.trim() || null,
          },
        }),
      ),
    );
  }

  async removeMembers(
    input: RemoveLotMembersInput,
    currentUser: CurrentUserType,
  ) {
    const rabbitIds = [...new Set(input.rabbitIds)];

    if (!rabbitIds.length) {
      throw new BadRequestException('Au moins un lapin doit être sélectionné.');
    }

    await this.findLot(input.lotId, currentUser);

    const memberships = await this.prisma.lotMembership.findMany({
      where: {
        lotId: input.lotId,
        rabbitId: { in: rabbitIds },
        leftAt: null,
      },
    });

    if (memberships.length !== rabbitIds.length) {
      throw new BadRequestException(
        'Un ou plusieurs lapins ne sont pas membres actifs de ce lot.',
      );
    }

    const leftAt = this.operationDate(input.date);
    const reason = input.reason?.trim() || null;

    return this.prisma.$transaction(
      memberships.map((membership) =>
        this.prisma.lotMembership.update({
          where: { id: membership.id },
          data: { leftAt, reason },
        }),
      ),
    );
  }

  async completeLot(
    input: CompleteFatteningLotInput,
    currentUser: CurrentUserType,
  ) {
    const lot = await this.findLot(input.id, currentUser);

    if (lot.status !== FatteningLotStatus.ACTIVE) {
      throw new ConflictException('Ce lot est déjà clôturé.');
    }

    const exitDate = new Date(input.exitDate ?? Date.now());
    this.validateDate(exitDate, 'de sortie');

    return this.prisma.$transaction(async (tx) => {
      await tx.lotMembership.updateMany({
        where: { lotId: lot.id, leftAt: null },
        data: { leftAt: exitDate, reason: 'Clôture du lot' },
      });

      await tx.lotCageMovement.updateMany({
        where: { lotId: lot.id, endedAt: null },
        data: { endedAt: exitDate },
      });

      const updated = await tx.fatteningLot.update({
        where: { id: lot.id },
        data: {
          status: FatteningLotStatus.COMPLETED,
          exitDate,
          observation: input.observation?.trim() || lot.observation,
        },
        include: lotInclude,
      });

      return this.toLotModel(updated);
    });
  }

  async memberships(lotId: string, currentUser: CurrentUserType) {
    const memberships = await this.prisma.lotMembership.findMany({
      where: {
        lotId,
        lot: { farmId: currentUser.farmId },
      },
      include: { rabbit: { select: { code: true } } },
      orderBy: { joinedAt: 'desc' },
    });

    return memberships.map(({ rabbit, ...membership }) => ({
      ...membership,
      rabbitCode: rabbit.code,
    }));
  }

  async createWeighing(
    input: CreateWeighingInput,
    currentUser: CurrentUserType,
  ) {
    if (!input.rabbitId && !input.lotId) {
      throw new BadRequestException('Un lapin ou un lot doit être renseigné.');
    }

    if (input.totalWeight <= 0 || input.animalCount <= 0) {
      throw new BadRequestException(
        'Le poids et le nombre d’animaux doivent être positifs.',
      );
    }

    const date = new Date(input.date);
    this.validateDate(date, 'de pesée');

    if (input.rabbitId) {
      const rabbit = await this.prisma.rabbit.findFirst({
        where: { id: input.rabbitId, farmId: currentUser.farmId },
      });

      if (!rabbit) {
        throw new NotFoundException('Lapin introuvable.');
      }
    }

    if (input.lotId) {
      await this.findLot(input.lotId, currentUser);
    }

    return this.prisma.weighing.create({
      data: {
        rabbitId: input.rabbitId,
        lotId: input.lotId,
        date,
        totalWeight: input.totalWeight,
        animalCount: input.animalCount,
        averageWeight:
          input.averageWeight ?? input.totalWeight / input.animalCount,
        ageInDays: input.ageInDays,
        observation: input.observation?.trim() || null,
      },
    });
  }

  weighings(
    currentUser: CurrentUserType,
    filters: { lotId?: string; rabbitId?: string } = {},
  ) {
    return this.prisma.weighing.findMany({
      where: {
        ...(filters.lotId ? { lotId: filters.lotId } : {}),
        ...(filters.rabbitId ? { rabbitId: filters.rabbitId } : {}),
        OR: [
          { rabbit: { farmId: currentUser.farmId } },
          { lot: { farmId: currentUser.farmId } },
        ],
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Déplace un lot d'engraissement vers une cage (LotCageMovement, §57).
   * Par défaut, chaque lapin actif du lot est aussi déplacé
   * individuellement pour conserver son historique propre (§56).
   */
  async moveLot(input: MoveFatteningLotInput, currentUser: CurrentUserType) {
    let reason: string | null;
    try {
      reason = normalizeMovementReason(input.reason) ?? 'FATTENING';
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const now = this.operationDate(input.date);
    const moveMembers = input.moveMembers ?? true;

    return this.prisma.$transaction(async (tx) => {
      const lot = await tx.fatteningLot.findFirst({
        where: { id: input.lotId, farmId: currentUser.farmId },
        include: {
          memberships: {
            where: { leftAt: null },
            include: { rabbit: { select: { id: true, status: true } } },
          },
        },
      });

      if (!lot) {
        throw new NotFoundException('Lot introuvable.');
      }

      if (lot.status !== FatteningLotStatus.ACTIVE) {
        throw new BadRequestException('Le lot n’est plus actif.');
      }

      const cage = await tx.cage.findFirst({
        where: { id: input.cageId, farmId: currentUser.farmId },
      });

      if (!cage) {
        throw new NotFoundException('Cage introuvable.');
      }

      if (cage.status !== 'ACTIVE') {
        throw new BadRequestException(
          `La cage ${cage.code} est inactive ou en maintenance.`,
        );
      }

      const current = await tx.lotCageMovement.findFirst({
        where: { lotId: lot.id, endedAt: null },
      });

      if (current?.cageId === cage.id) {
        throw new BadRequestException('Le lot se trouve déjà dans cette cage.');
      }

      const memberIds = lot.memberships
        .filter((membership) => membership.rabbit.status === RabbitStatus.ACTIVE)
        .map((membership) => membership.rabbitId);

      if (moveMembers) {
        const occupants = await tx.rabbitCageMovement.count({
          where: {
            cageId: cage.id,
            endedAt: null,
            rabbitId: { notIn: memberIds },
          },
        });

        if (occupants + memberIds.length > cage.capacity) {
          throw new BadRequestException(
            `Impossible de déplacer ${memberIds.length} lapin(s). La cage ${cage.code} a une capacité maximale de ${cage.capacity} lapin(s) et en contient déjà ${occupants}.`,
          );
        }

        await tx.rabbitCageMovement.updateMany({
          where: { rabbitId: { in: memberIds }, endedAt: null },
          data: { endedAt: now },
        });

        if (memberIds.length) {
          await tx.rabbitCageMovement.createMany({
            data: memberIds.map((rabbitId) => ({
              rabbitId,
              cageId: cage.id,
              startedAt: now,
              reason,
              observation: `Déplacement du lot ${lot.code}`,
            })),
          });
        }
      }

      if (current) {
        await tx.lotCageMovement.update({
          where: { id: current.id },
          data: { endedAt: now },
        });
      }

      const movement = await tx.lotCageMovement.create({
        data: {
          lotId: lot.id,
          cageId: cage.id,
          startedAt: now,
          reason,
          observation: input.observation?.trim() || null,
        },
      });

      return { ...movement, cageCode: cage.code };
    });
  }

  async lotCageMovements(lotId: string, currentUser: CurrentUserType) {
    await this.findLot(lotId, currentUser);

    const movements = await this.prisma.lotCageMovement.findMany({
      where: { lotId },
      include: { cage: { select: { code: true } } },
      orderBy: { startedAt: 'desc' },
    });

    return movements.map(({ cage, ...movement }) => ({
      ...movement,
      cageCode: cage.code,
    }));
  }

  // ============================================================
  // CORRECTIONS (modifier / supprimer)
  // ============================================================

  async updateLot(input: UpdateFatteningLotInput, currentUser: CurrentUserType) {
    const lot = await this.findLot(input.id, currentUser);
    const code = input.code?.trim().toUpperCase();
    if (input.code !== undefined && !code) {
      throw new BadRequestException('Le code du lot est obligatoire.');
    }
    if (code && code !== lot.code) {
      const duplicate = await this.prisma.fatteningLot.findUnique({
        where: { farmId_code: { farmId: currentUser.farmId, code } },
      });
      if (duplicate) {
        throw new ConflictException('Ce code de lot existe déjà.');
      }
    }
    const entryDate = input.entryDate ? new Date(input.entryDate) : undefined;
    if (entryDate) this.validateDate(entryDate, "d'entrée");
    const updated = await this.prisma.fatteningLot.update({
      where: { id: lot.id },
      data: {
        code,
        entryDate,
        observation:
          input.observation === undefined ? undefined : input.observation.trim() || null,
      },
      include: lotInclude,
    });
    return this.toLotModel(updated);
  }

  /** Supprime un lot créé par erreur (sans vente rattachée). */
  async deleteLot(id: string, currentUser: CurrentUserType) {
    const lot = await this.findLot(id, currentUser);
    const sales = await this.prisma.saleItem.count({ where: { lotId: lot.id } });
    if (sales) {
      throw new ConflictException('Ce lot a été vendu : supprime d’abord la vente.');
    }
    await this.prisma.fatteningLot.delete({ where: { id: lot.id } });
    return true;
  }

  private async findWeighing(id: string, currentUser: CurrentUserType) {
    const weighing = await this.prisma.weighing.findFirst({
      where: {
        id,
        OR: [
          { rabbit: { farmId: currentUser.farmId } },
          { lot: { farmId: currentUser.farmId } },
        ],
      },
    });
    if (!weighing) {
      throw new NotFoundException('Pesée introuvable.');
    }
    return weighing;
  }

  async updateWeighing(input: UpdateWeighingInput, currentUser: CurrentUserType) {
    const weighing = await this.findWeighing(input.id, currentUser);
    const totalWeight = input.totalWeight ?? weighing.totalWeight;
    const animalCount = input.animalCount ?? weighing.animalCount;
    if (totalWeight <= 0 || animalCount <= 0) {
      throw new BadRequestException(
        'Le poids et le nombre d’animaux doivent être positifs.',
      );
    }
    const date = input.date ? new Date(input.date) : undefined;
    if (date) this.validateDate(date, 'de pesée');
    const recompute = input.totalWeight != null || input.animalCount != null;
    return this.prisma.weighing.update({
      where: { id: weighing.id },
      data: {
        date,
        totalWeight,
        animalCount,
        averageWeight:
          input.averageWeight ?? (recompute ? totalWeight / animalCount : undefined),
        observation:
          input.observation === undefined ? undefined : input.observation.trim() || null,
      },
    });
  }

  async deleteWeighing(id: string, currentUser: CurrentUserType) {
    const weighing = await this.findWeighing(id, currentUser);
    await this.prisma.weighing.delete({ where: { id: weighing.id } });
    return true;
  }
}
