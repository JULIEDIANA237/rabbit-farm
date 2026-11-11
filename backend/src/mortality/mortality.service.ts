import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import {
  BreedingStatus,
  LitterStatus,
  MortalityScope,
  RabbitStatus,
  TaskStatus,
} from '../generated/prisma/client.js';

import { RecordRabbitExitInput } from './inputs/record-rabbit-exit.input.js';
import { RecordLitterMortalityInput } from './inputs/record-litter-mortality.input.js';
import { mapRabbit } from '../rabbits/rabbits.service.js';

const EXIT_STATUSES: RabbitStatus[] = [
  RabbitStatus.DEAD,
  RabbitStatus.CULLED,
  RabbitStatus.TRANSFERRED,
];

const mortalityInclude = {
  rabbit: { select: { code: true } },
  litter: { select: { code: true } },
  lot: { select: { code: true } },
} as const;

type MortalityWithRelations = {
  rabbit?: { code: string } | null;
  litter?: { code: string } | null;
  lot?: { code: string } | null;
  [key: string]: unknown;
};

/**
 * Mortalité et sorties de l'élevage (§37, §58).
 *
 * Un lapin n'est jamais supprimé : on change son statut
 * (DEAD, CULLED, TRANSFERRED) et on clôture ses emplacements.
 */
@Injectable()
export class MortalityService {
  constructor(private readonly prisma: PrismaService) {}

  private toModel<T extends MortalityWithRelations>(record: T) {
    const { rabbit, litter, lot, ...rest } = record;
    return {
      ...rest,
      rabbitCode: rabbit?.code ?? null,
      litterCode: litter?.code ?? null,
      lotCode: lot?.code ?? null,
    };
  }

  private parseDate(value: Date) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('La date est invalide.');
    }
    if (date.getTime() > Date.now() + 86_400_000) {
      throw new BadRequestException('La date ne peut pas être dans le futur.');
    }
    return date;
  }

  /**
   * Décès, réforme ou transfert d'un lapin identifié.
   */
  async recordRabbitExit(
    input: RecordRabbitExitInput,
    currentUser: CurrentUserType,
  ) {
    if (!EXIT_STATUSES.includes(input.status)) {
      throw new BadRequestException(
        'Le statut de sortie doit être DEAD, CULLED ou TRANSFERRED. Utilisez une vente pour SOLD.',
      );
    }

    const date = this.parseDate(input.date);

    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: input.rabbitId, farmId: currentUser.farmId },
      include: {
        birthLitter: true,
        lotMemberships: { where: { leftAt: null }, take: 1 },
      },
    });

    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }

    if (rabbit.status !== RabbitStatus.ACTIVE) {
      throw new ConflictException(
        `Le lapin ${rabbit.code} n'est plus actif (${rabbit.status}).`,
      );
    }

    if (rabbit.birthDate && date < rabbit.birthDate) {
      throw new BadRequestException(
        'La date de sortie ne peut pas précéder la naissance.',
      );
    }

    const cause = input.cause?.trim() || null;
    const observation = input.observation?.trim() || null;
    const activeLot = rabbit.lotMemberships[0];

    const updated = await this.prisma.$transaction(async (tx) => {
      // Clôture de l'emplacement actuel
      await tx.rabbitCageMovement.updateMany({
        where: { rabbitId: rabbit.id, endedAt: null },
        data: { endedAt: date },
      });

      // Sortie du lot d'engraissement
      await tx.lotMembership.updateMany({
        where: { rabbitId: rabbit.id, leftAt: null },
        data: {
          leftAt: date,
          reason: input.status === RabbitStatus.DEAD ? 'Décès' : 'Sortie',
        },
      });

      // Accouplements en cours annulés
      await tx.breeding.updateMany({
        where: {
          farmId: currentUser.farmId,
          OR: [{ femaleId: rabbit.id }, { maleId: rabbit.id }],
          status: {
            in: [
              BreedingStatus.PLANNED,
              BreedingStatus.AWAITING_PALPATION,
              BreedingStatus.INCONCLUSIVE,
              ...(rabbit.sex === 'FEMALE' ? [BreedingStatus.PREGNANT] : []),
            ],
          },
        },
        data: { status: BreedingStatus.CANCELLED },
      });

      // Tâches ouvertes du lapin annulées
      await tx.task.updateMany({
        where: {
          farmId: currentUser.farmId,
          rabbitId: rabbit.id,
          status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
        },
        data: { status: TaskStatus.CANCELLED },
      });

      if (input.status === RabbitStatus.DEAD) {
        const inActiveLitter =
          rabbit.birthLitter &&
          rabbit.birthLitter.status === LitterStatus.ACTIVE &&
          rabbit.birthLitter.currentCount > 0;

        await tx.mortalityRecord.create({
          data: {
            farmId: currentUser.farmId,
            scope: MortalityScope.RABBIT,
            rabbitId: rabbit.id,
            litterId: rabbit.birthLitterId,
            lotId: activeLot?.lotId ?? null,
            date,
            count: 1,
            cause,
            observation,
          },
        });

        if (inActiveLitter && rabbit.birthLitter) {
          await tx.litter.update({
            where: { id: rabbit.birthLitter.id },
            data: { currentCount: { decrement: 1 } },
          });
        }
      }

      return tx.rabbit.update({
        where: { id: rabbit.id },
        data: {
          status: input.status,
          exitDate: date,
          exitCause: cause,
          observations: observation
            ? [rabbit.observations, observation].filter(Boolean).join('\n')
            : undefined,
        },
        include: { identifications: true, photos: true },
      });
    });

    return mapRabbit(updated);
  }

  /**
   * Mortalité de lapereaux non identifiés d'une portée (§37).
   */
  async recordLitterMortality(
    input: RecordLitterMortalityInput,
    currentUser: CurrentUserType,
  ) {
    if (!Number.isInteger(input.count) || input.count <= 0) {
      throw new BadRequestException(
        'Le nombre de morts doit être un entier positif.',
      );
    }

    const date = this.parseDate(input.date);

    const litter = await this.prisma.litter.findFirst({
      where: { id: input.litterId, farmId: currentUser.farmId },
    });

    if (!litter) {
      throw new NotFoundException('Portée introuvable.');
    }

    if (date < litter.birthDate) {
      throw new BadRequestException(
        'La date ne peut pas précéder la naissance de la portée.',
      );
    }

    if (input.count > litter.currentCount) {
      throw new BadRequestException(
        `La portée ${litter.code} ne compte que ${litter.currentCount} lapereau(x).`,
      );
    }

    const record = await this.prisma.$transaction(async (tx) => {
      const created = await tx.mortalityRecord.create({
        data: {
          farmId: currentUser.farmId,
          scope: MortalityScope.LITTER,
          litterId: litter.id,
          date,
          count: input.count,
          cause: input.cause?.trim() || null,
          observation: input.observation?.trim() || null,
        },
        include: mortalityInclude,
      });

      const remaining = litter.currentCount - input.count;

      await tx.litter.update({
        where: { id: litter.id },
        data: {
          currentCount: remaining,
          ...(remaining === 0 ? { status: LitterStatus.CLOSED } : {}),
        },
      });

      return created;
    });

    return this.toModel(record);
  }

  async findAll(
    currentUser: CurrentUserType,
    from?: Date,
    to?: Date,
  ) {
    const records = await this.prisma.mortalityRecord.findMany({
      where: {
        farmId: currentUser.farmId,
        ...(from || to
          ? { date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
          : {}),
      },
      include: mortalityInclude,
      orderBy: { date: 'desc' },
    });

    return records.map((record) => this.toModel(record));
  }
}
