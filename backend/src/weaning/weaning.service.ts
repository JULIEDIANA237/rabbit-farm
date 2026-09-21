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

@Injectable()
export class WeaningService {
  constructor(private readonly prisma: PrismaService) {}

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
        include: { rabbits: true },
      });

      if (input.actualDate) {
        await tx.litter.update({
          where: { id: input.litterId },
          data: { currentCount: { decrement: input.quantity } },
        });
      }

      return weaning;
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
          rabbits: {
            deleteMany: {},
            create: rabbitIds.map((rabbitId) => ({ rabbitId })),
          },
        },
        include: { rabbits: true },
      });

      await tx.litter.update({
        where: { id: weaning.litterId },
        data: { currentCount: { decrement: quantity } },
      });

      return updated;
    });
  }

  findAll(currentUser: CurrentUserType) {
    return this.prisma.weaning.findMany({
      where: { farmId: currentUser.farmId },
      include: { rabbits: true },
      orderBy: { plannedDate: 'desc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const weaning = await this.prisma.weaning.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: { rabbits: true },
    });

    if (!weaning) {
      throw new NotFoundException('Sevrage introuvable.');
    }

    return weaning;
  }

  async findByLitter(litterId: string, currentUser: CurrentUserType) {
    const litter = await this.prisma.litter.findFirst({
      where: { id: litterId, farmId: currentUser.farmId },
      select: { id: true },
    });

    if (!litter) {
      throw new NotFoundException('Portée introuvable.');
    }

    return this.prisma.weaning.findMany({
      where: { litterId, farmId: currentUser.farmId },
      include: { rabbits: true },
      orderBy: { plannedDate: 'desc' },
    });
  }
}
