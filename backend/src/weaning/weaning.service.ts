import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreateWeaningInput } from './inputs/create-weaning.input';
import { CompleteWeaningInput } from './inputs/complete-weaning.input';
import { TaskAutomationService } from '../operations/automation/task-automation.service';
import {
  FatteningLotStatus,
  LitterStatus,
  RabbitPurpose,
  RabbitStatus,
  type Prisma,
} from '../generated/prisma/client';

const weaningInclude = {
  rabbits: true,
  litter: { select: { code: true } },
} as const;

@Injectable()
export class WeaningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasks: TaskAutomationService,
  ) {}

  private toModel<T extends { litter?: { code: string } | null; totalWeight?: unknown; averageWeight?: unknown }>(
    weaning: T,
  ) {
    const { litter, ...rest } = weaning;
    return {
      ...rest,
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

    if (params.fatteningLotId) {
      const lot = await tx.fatteningLot.findFirst({
        where: { id: params.fatteningLotId, farmId: params.farmId },
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
    }
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

    const rabbitIds = [...new Set(input.rabbitIds ?? [])];
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

    return this.prisma.$transaction(async (tx) => {
      const weaning = await tx.weaning.create({
        data: {
          farmId: currentUser.farmId,
          litterId: input.litterId,
          plannedDate,
          quantity: input.quantity,
          totalWeight: input.totalWeight,
          averageWeight: input.averageWeight,
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
        });
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

    const rabbitIds = [...new Set(input.rabbitIds ?? weaning.rabbits.map((rabbit) => rabbit.rabbitId))];
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
          totalWeight: input.totalWeight ?? undefined,
          averageWeight: input.averageWeight ?? undefined,
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
      });
      return this.toModel(updated);
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
}
