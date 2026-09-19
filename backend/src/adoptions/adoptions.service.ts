import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';
import { CreateAdoptionInput } from './inputs/create-adoption.input';

@Injectable()
export class AdoptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    input: CreateAdoptionInput,
    currentUser: CurrentUserType,
  ) {
    if (input.sourceLitterId === input.destinationLitterId) {
      throw new BadRequestException(
        'Les portées source et destination doivent être différentes.',
      );
    }

    if (input.quantity <= 0) {
      throw new BadRequestException(
        'La quantité transférée doit être supérieure à zéro.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const sourceLitter = await tx.litter.findFirst({
        where: {
          id: input.sourceLitterId,
          farmId: currentUser.farmId,
        },
      });

      const destinationLitter = await tx.litter.findFirst({
        where: {
          id: input.destinationLitterId,
          farmId: currentUser.farmId,
        },
      });

      if (!sourceLitter || !destinationLitter) {
        throw new NotFoundException(
          'Portée source ou destination introuvable.',
        );
      }

      if (sourceLitter.currentCount < input.quantity) {
        throw new BadRequestException(
          'La portée source ne contient pas assez de lapereaux.',
        );
      }

      const adoption = await tx.litterAdoption.create({
        data: {
          sourceLitterId: sourceLitter.id,
          destinationLitterId: destinationLitter.id,
          quantity: input.quantity,
          date: input.date,
          reason: input.reason,
          observation: input.observation?.trim() || null,
        },
      });

      await tx.litter.update({
        where: { id: sourceLitter.id },
        data: { currentCount: { decrement: input.quantity } },
      });

      await tx.litter.update({
        where: { id: destinationLitter.id },
        data: { currentCount: { increment: input.quantity } },
      });

      return adoption;
    });
  }

  async findAll(currentUser: CurrentUserType) {
    return this.prisma.litterAdoption.findMany({
      where: {
        sourceLitter: { farmId: currentUser.farmId },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByLitter(
    litterId: string,
    currentUser: CurrentUserType,
  ) {
    const litter = await this.prisma.litter.findFirst({
      where: {
        id: litterId,
        farmId: currentUser.farmId,
      },
    });

    if (!litter) {
      throw new NotFoundException(
        'Portée introuvable.',
      );
    }

    return this.prisma.litterAdoption.findMany({
      where: {
        OR: [
          { sourceLitterId: litterId },
          { destinationLitterId: litterId },
        ],
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}