import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CreateWeaningInput } from './inputs/create-weaning.input.js';
import { CompleteWeaningInput } from './inputs/complete-weaning.input.js';
import { UpdateWeaningInput } from './inputs/update-weaning.input.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';
import {
  FatteningLotStatus,
  LitterStatus,
  RabbitPurpose,
  RabbitStatus,
  TaskSourceType,
  TaskStatus,
  type Prisma,
} from '../generated/prisma/client.js';

const weaningInclude = {
  rabbits: {
    include: {
      rabbit: {
        select: {
          lotMemberships: {
            where: { reason: 'Sevrage' },
            select: { lot: { select: { id: true, code: true } } },
            orderBy: { joinedAt: 'desc' as const },
            take: 1,
          },
        },
      },
    },
  },
  litter: { select: { code: true } },
} as const;

type WeaningRabbitWithLot = { rabbit?: { lotMemberships: Array<{ lot: { id: string; code: string } }> } };

@Injectable()
export class WeaningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasks: TaskAutomationService,
  ) {}

  private toModel<
    T extends {
      litter?: { code: string } | null;
      totalWeight?: unknown;
      averageWeight?: unknown;
      rabbits?: Array<WeaningRabbitWithLot & object>;
    },
  >(weaning: T) {
    const { litter, ...rest } = weaning;
    const lot = weaning.rabbits?.map((r) => r.rabbit?.lotMemberships[0]?.lot).find(Boolean);
    return {
      ...rest,
      rabbits: (weaning.rabbits ?? []).map(({ rabbit: _rabbit, ...r }) => r),
      fatteningLotId: lot?.id ?? null,
      fatteningLotCode: lot?.code ?? null,
      litterCode: litter?.code ?? null,
      totalWeight: weaning.totalWeight != null ? Number(weaning.totalWeight) : null,
      averageWeight: weaning.averageWeight != null ? Number(weaning.averageWeight) : null,
    };
  }

  /**
   * Effets d'un sevrage réalisé : effectif de la portée, statut,
   * tâches et, si demandé, entrée en lot d'engraissement.
   */
  private async applyCompletedWeaning(
    tx: Prisma.TransactionClient,
    params: {
      farmId: string;
      litterId: string;
      quantity: number;
      date: Date;
      rabbitIds: string[];
      fatteningLotId?: string;
      createFatteningLot?: boolean;
      totalWeight?: number | null;
      averageWeight?: number | null;
    },
  ) {
    const litter = await tx.litter.update({
      where: { id: params.litterId },
      data: { currentCount: { decrement: params.quantity } },
    });

    if (litter.currentCount <= 0) {
      await tx.litter.update({
        where: { id: litter.id },
        data: { currentCount: 0, status: LitterStatus.WEANED },
      });
    }

    await this.tasks.onWeaningCompleted(params.farmId, litter.birthId, tx);

    let lotId = params.fatteningLotId;
    if (!lotId && params.createFatteningLot) {
      lotId = (await this.createLotForLitter(tx, params.farmId, litter.code, params.date)).id;
    }

    if (lotId) {
      const lot = await tx.fatteningLot.findFirst({
        where: { id: lotId, farmId: params.farmId },
      });

      if (!lot || lot.status !== FatteningLotStatus.ACTIVE) {
        throw new BadRequestException(
          "Le lot d'engraissement est introuvable ou n'est plus actif.",
        );
      }

      const alreadyInLot = await tx.lotMembership.findMany({
        where: { rabbitId: { in: params.rabbitIds }, leftAt: null },
        select: { rabbitId: true },
      });
      const excluded = new Set(alreadyInLot.map((m) => m.rabbitId));
      const toAdd = params.rabbitIds.filter((id) => !excluded.has(id));

      if (toAdd.length) {
        await tx.lotMembership.createMany({
          data: toAdd.map((rabbitId) => ({
            lotId: lot.id,
            rabbitId,
            joinedAt: params.date,
            reason: 'Sevrage',
          })),
        });

        await tx.rabbit.updateMany({
          where: { id: { in: toAdd }, status: RabbitStatus.ACTIVE },
          data: { purpose: RabbitPurpose.FATTENING },
        });
      }

      // Pesée d'entrée : le poids du sevrage devient le point de départ
      // du suivi de croissance du lot (GMQ).
      const weights = weaningWeights(params.quantity, params.totalWeight, params.averageWeight);
      if (weights) {
        await tx.weighing.create({
          data: {
            lotId: lot.id,
            date: params.date,
            totalWeight: weights.totalWeight,
            animalCount: params.quantity,
            averageWeight: weights.averageWeight,
            ageInDays: Math.max(0, Math.round((params.date.getTime() - litter.birthDate.getTime()) / 86_400_000)),
            observation: 'Pesée au sevrage',
          },
        });
      }
    }
  }

  /** Lot d'engraissement créé au sevrage, nommé d’après la portée (LOT-L012, LOT-L012-2…). */
  private async createLotForLitter(tx: Prisma.TransactionClient, farmId: string, litterCode: string, date: Date) {
    const base = `LOT-${litterCode}`;
    let code = base;
    for (let i = 2; await tx.fatteningLot.findFirst({ where: { farmId, code }, select: { id: true } }); i += 1) {
      code = `${base}-${i}`;
    }
    return tx.fatteningLot.create({
      data: { farmId, code, entryDate: date, observation: `Créé au sevrage de la portée ${litterCode}` },
    });
  }

  /**
   * Lapereaux concernés par un sevrage réalisé. Si aucun n'est choisi,
   * on prend les lapereaux encore actifs de la portée (dans l'ordre des codes),
   * jusqu'au nombre sevré, pour qu'ils rejoignent bien le lot d'engraissement.
   */
  private async resolveWeanedRabbits(farmId: string, litterId: string, provided: string[], quantity: number) {
    if (provided.length > 0) return provided;
    const kits = await this.prisma.rabbit.findMany({
      where: {
        farmId,
        birthLitterId: litterId,
        status: RabbitStatus.ACTIVE,
        lotMemberships: { none: { leftAt: null } },
      },
      orderBy: { code: 'asc' },
      select: { id: true },
      take: quantity,
    });
    return kits.map((k) => k.id);
  }

  private validateQuantity(quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException(
        'La quantité sevrée doit être un entier supérieur à zéro.',
      );
    }
  }

  private validateDate(date: Date, fieldName: string) {
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`La date ${fieldName} est invalide.`);
    }
  }

  async create(input: CreateWeaningInput, currentUser: CurrentUserType) {
    this.validateQuantity(input.quantity);
    const plannedDate = new Date(input.plannedDate);
    this.validateDate(plannedDate, 'prévue');

    const litter = await this.prisma.litter.findFirst({
      where: { id: input.litterId, farmId: currentUser.farmId },
    });

    if (!litter) {
      throw new NotFoundException('Portée introuvable.');
    }

    if (input.quantity > litter.currentCount) {
      throw new BadRequestException(
        'La quantité prévue dépasse le nombre de lapereaux disponibles.',
      );
    }

    let rabbitIds = [...new Set(input.rabbitIds ?? [])];
    if (rabbitIds.length > input.quantity) {
      throw new BadRequestException(
        'Le nombre de lapins sélectionnés dépasse la quantité prévue.',
      );
    }

    if (rabbitIds.length > 0) {
      const rabbits = await this.prisma.rabbit.findMany({
        where: {
          id: { in: rabbitIds },
          farmId: currentUser.farmId,
          birthLitterId: input.litterId,
        },
        select: { id: true },
      });

      if (rabbits.length !== rabbitIds.length) {
        throw new BadRequestException(
          'Un ou plusieurs lapins ne font pas partie de cette portée.',
        );
      }
    }

    if (input.actualDate) {
      rabbitIds = await this.resolveWeanedRabbits(currentUser.farmId, input.litterId, rabbitIds, input.quantity);
    }

    return this.prisma.$transaction(async (tx) => {
      const weaning = await tx.weaning.create({
        data: {
          farmId: currentUser.farmId,
          litterId: input.litterId,
          plannedDate,
          quantity: input.quantity,
          ...(weaningWeights(input.quantity, input.totalWeight, input.averageWeight) ?? {}),
          observation: input.observation?.trim() || null,
          actualDate: input.actualDate
            ? new Date(input.actualDate)
            : null,
          rabbits: rabbitIds.length
            ? { create: rabbitIds.map((rabbitId) => ({ rabbitId })) }
            : undefined,
        },
        include: weaningInclude,
      });
      if (input.actualDate) {
        await this.applyCompletedWeaning(tx, {
          farmId: currentUser.farmId,
          litterId: input.litterId,
          quantity: input.quantity,
          date: new Date(input.actualDate),
          rabbitIds,
          fatteningLotId: input.fatteningLotId,
          createFatteningLot: input.createFatteningLot,
          totalWeight: input.totalWeight,
          averageWeight: input.averageWeight,
        });
        // Relire pour renvoyer le lot créé par le sevrage.
        return this.toModel(await tx.weaning.findUniqueOrThrow({ where: { id: weaning.id }, include: weaningInclude }));
      }
      return this.toModel(weaning);
    });
  }

  async complete(input: CompleteWeaningInput, currentUser: CurrentUserType) {
    const actualDate = new Date(input.actualDate);
    this.validateDate(actualDate, 'effective');

    const weaning = await this.prisma.weaning.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
      include: { rabbits: true, litter: true },
    });

    if (!weaning) {
      throw new NotFoundException('Sevrage introuvable.');
    }

    if (weaning.actualDate) {
      throw new ConflictException('Ce sevrage est déjà réalisé.');
    }

    const quantity = input.quantity ?? weaning.quantity;
    this.validateQuantity(quantity);

    if (quantity > weaning.litter.currentCount) {
      throw new BadRequestException(
        'La quantité sevrée dépasse le nombre de lapereaux disponibles.',
      );
    }

    const rabbitIds = await this.resolveWeanedRabbits(
      currentUser.farmId,
      weaning.litterId,
      [...new Set(input.rabbitIds ?? weaning.rabbits.map((rabbit) => rabbit.rabbitId))],
      quantity,
    );
    if (rabbitIds.length > quantity) {
      throw new BadRequestException(
        'Le nombre de lapins sélectionnés dépasse la quantité sevrée.',
      );
    }

    const rabbits = await this.prisma.rabbit.findMany({
      where: {
        id: { in: rabbitIds },
        farmId: currentUser.farmId,
        birthLitterId: weaning.litterId,
      },
      select: { id: true },
    });

    if (rabbits.length !== rabbitIds.length) {
      throw new BadRequestException(
        'Un ou plusieurs lapins ne font pas partie de cette portée.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.weaning.update({
        where: { id: weaning.id },
        data: {
          actualDate,
          quantity,
          ...(weaningWeights(quantity, input.totalWeight, input.averageWeight) ?? {}),
          observation: input.observation?.trim() || undefined,
          rabbits: {
            deleteMany: {},
            create: rabbitIds.map((rabbitId) => ({ rabbitId })),
          },
        },
        include: weaningInclude,
      });
      await this.applyCompletedWeaning(tx, {
        farmId: currentUser.farmId,
        litterId: weaning.litterId,
        quantity,
        date: actualDate,
        rabbitIds,
        fatteningLotId: input.fatteningLotId,
        createFatteningLot: input.createFatteningLot,
        totalWeight: input.totalWeight ?? (weaning.totalWeight != null ? Number(weaning.totalWeight) : null),
        averageWeight: input.averageWeight ?? (weaning.averageWeight != null ? Number(weaning.averageWeight) : null),
      });
      return this.toModel(await tx.weaning.findUniqueOrThrow({ where: { id: updated.id }, include: weaningInclude }));
    });
  }

  async findAll(currentUser: CurrentUserType) {
    const weanings = await this.prisma.weaning.findMany({
      where: { farmId: currentUser.farmId },
      include: weaningInclude,
      orderBy: { plannedDate: 'desc' },
    });
    return weanings.map((weaning) => this.toModel(weaning));
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const weaning = await this.prisma.weaning.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: weaningInclude,
    });
    if (!weaning) {
      throw new NotFoundException('Sevrage introuvable.');
    }
    return this.toModel(weaning);
  }

  async findByLitter(litterId: string, currentUser: CurrentUserType) {
    const litter = await this.prisma.litter.findFirst({
      where: { id: litterId, farmId: currentUser.farmId },
      select: { id: true },
    });

    if (!litter) {
      throw new NotFoundException('Portée introuvable.');
    }

    const weanings = await this.prisma.weaning.findMany({
      where: { litterId, farmId: currentUser.farmId },
      include: weaningInclude,
      orderBy: { plannedDate: 'desc' },
    });
    return weanings.map((weaning) => this.toModel(weaning));
  }

  async update(input: UpdateWeaningInput, currentUser: CurrentUserType) {
    const weaning = await this.prisma.weaning.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
      include: { rabbits: true, litter: true },
    });
    if (!weaning) {
      throw new NotFoundException('Sevrage introuvable.');
    }
    const plannedDate = input.plannedDate ? new Date(input.plannedDate) : undefined;
    if (plannedDate) this.validateDate(plannedDate, 'prévue');
    let actualDate: Date | undefined;
    if (input.actualDate) {
      if (!weaning.actualDate) {
        throw new BadRequestException('Utilise « Réaliser le sevrage » pour un sevrage prévu.');
      }
      actualDate = new Date(input.actualDate);
      this.validateDate(actualDate, 'effective');
      if (actualDate < weaning.litter.birthDate) {
        throw new BadRequestException('Le sevrage ne peut pas précéder la naissance.');
      }
    }
    const updated = await this.prisma.$transaction(async (tx) => {
      if (actualDate && weaning.actualDate && actualDate.getTime() !== weaning.actualDate.getTime()) {
        await tx.lotMembership.updateMany({
          where: {
            rabbitId: { in: weaning.rabbits.map((r) => r.rabbitId) },
            joinedAt: weaning.actualDate,
            reason: 'Sevrage',
          },
          data: { joinedAt: actualDate },
        });
      }
      return tx.weaning.update({
        where: { id: weaning.id },
        data: {
          plannedDate,
          actualDate,
          totalWeight: input.totalWeight ?? undefined,
          averageWeight: input.averageWeight ?? undefined,
          observation:
            input.observation === undefined ? undefined : input.observation.trim() || null,
        },
        include: weaningInclude,
      });
    });
    return this.toModel(updated);
  }

  /**
   * Supprime un sevrage saisi par erreur. S'il était réalisé, les
   * lapereaux reviennent dans la portée et leur entrée en lot
   * d'engraissement (faite au sevrage) est retirée.
   */
  async remove(id: string, currentUser: CurrentUserType) {
    const weaning = await this.prisma.weaning.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: { rabbits: true, litter: true },
    });
    if (!weaning) {
      throw new NotFoundException('Sevrage introuvable.');
    }
    await this.prisma.$transaction(async (tx) => {
      if (weaning.actualDate) {
        const rabbitIds = weaning.rabbits.map((r) => r.rabbitId);
        if (rabbitIds.length) {
          await tx.lotMembership.deleteMany({
            where: {
              rabbitId: { in: rabbitIds },
              joinedAt: weaning.actualDate,
              reason: 'Sevrage',
              leftAt: null,
            },
          });
        }
        await tx.litter.update({
          where: { id: weaning.litterId },
          data: {
            currentCount: { increment: weaning.quantity },
            ...(weaning.litter.status === LitterStatus.WEANED
              ? { status: LitterStatus.ACTIVE }
              : {}),
          },
        });
        if (weaning.litter.birthId) {
          await tx.task.updateMany({
            where: {
              farmId: currentUser.farmId,
              sourceType: TaskSourceType.BIRTH,
              sourceId: weaning.litter.birthId,
              automationKey: 'LITTER_WEANING',
              status: TaskStatus.COMPLETED,
            },
            data: { status: TaskStatus.TODO, completedAt: null },
          });
        }
      }
      await tx.weaning.delete({ where: { id: weaning.id } });
    });
    return true;
  }
}

/**
 * Poids d'un sevrage : on peut saisir le poids total (toute la portée sevrée
 * pesée ensemble) OU le poids moyen (un lapereau) ; l'autre se calcule.
 */
export function weaningWeights(quantity: number, totalWeight?: number | null, averageWeight?: number | null) {
  const round = (v: number) => Math.round(v * 1000) / 1000;
  if (totalWeight != null && totalWeight > 0) {
    return { totalWeight: round(totalWeight), averageWeight: quantity > 0 ? round(totalWeight / quantity) : null };
  }
  if (averageWeight != null && averageWeight > 0) {
    return { totalWeight: round(averageWeight * quantity), averageWeight: round(averageWeight) };
  }
  return null;
}
