import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';
import { CreateAdoptionInput } from './inputs/create-adoption.input';

const adoptionInclude = {
  sourceLitter: { select: { code: true } },
  destinationLitter: { select: { code: true } },
  rabbits: { select: { rabbitId: true } },
} as const;

type AdoptionWithRelations = {
  sourceLitter?: { code: string } | null;
  destinationLitter?: { code: string } | null;
  rabbits?: Array<{ rabbitId: string }>;
  [key: string]: unknown;
};

/**
 * Adoption / égalisation de portées (§32, §33).
 * La généalogie des lapereaux n'est jamais modifiée :
 * seule la portée d'élevage (mère nourricière) change.
 */
@Injectable()
export class AdoptionsService {
  constructor(private readonly prisma: PrismaService) {}

  private toModel<T extends AdoptionWithRelations>(adoption: T) {
    const { sourceLitter, destinationLitter, rabbits, ...rest } = adoption;
    return {
      ...rest,
      sourceLitterCode: sourceLitter?.code ?? null,
      destinationLitterCode: destinationLitter?.code ?? null,
      rabbitIds: rabbits?.map((rabbit) => rabbit.rabbitId) ?? [],
    };
  }

  async create(
    input: CreateAdoptionInput,
    currentUser: CurrentUserType,
  ) {
    if (input.sourceLitterId === input.destinationLitterId) {
      throw new BadRequestException(
        'Les portées source et destination doivent être différentes.',
      );
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      throw new BadRequestException(
        'La quantité transférée doit être un entier supérieur à zéro.',
      );
    }

    const rabbitIds = [...new Set(input.rabbitIds ?? [])];

    if (rabbitIds.length > 0 && rabbitIds.length !== input.quantity) {
      throw new BadRequestException(
        'Le nombre de lapereaux sélectionnés doit correspondre à la quantité transférée.',
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

      if (rabbitIds.length > 0) {
        const kits = await tx.rabbit.findMany({
          where: {
            id: { in: rabbitIds },
            farmId: currentUser.farmId,
            status: 'ACTIVE',
            OR: [
              { birthLitterId: sourceLitter.id },
              {
                adoptionHistory: {
                  some: { adoption: { destinationLitterId: sourceLitter.id } },
                },
              },
            ],
          },
          select: { id: true },
        });

        if (kits.length !== rabbitIds.length) {
          throw new BadRequestException(
            'Un ou plusieurs lapereaux ne sont pas élevés dans la portée source.',
          );
        }
      }

      const adoption = await tx.litterAdoption.create({
        data: {
          sourceLitterId: sourceLitter.id,
          destinationLitterId: destinationLitter.id,
          quantity: input.quantity,
          adoptedAt: input.date,
          reason: input.reason,
          farmId: currentUser.farmId,
          observation: input.observation?.trim() || null,
          rabbits: rabbitIds.length
            ? { create: rabbitIds.map((rabbitId) => ({ rabbitId })) }
            : undefined,
        },
        include: adoptionInclude,
      });

      await tx.litter.update({
        where: { id: sourceLitter.id },
        data: { currentCount: { decrement: input.quantity } },
      });

      await tx.litter.update({
        where: { id: destinationLitter.id },
        data: { currentCount: { increment: input.quantity } },
      });

      return this.toModel(adoption);
    });
  }

  async findAll(currentUser: CurrentUserType) {
    const adoptions = await this.prisma.litterAdoption.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      include: adoptionInclude,
      orderBy: {
        adoptedAt: 'desc',
      },
    });
    return adoptions.map((adoption) => this.toModel(adoption));
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

    const adoptions = await this.prisma.litterAdoption.findMany({
      where: {
        farmId: currentUser.farmId,
        OR: [
          { sourceLitterId: litterId },
          { destinationLitterId: litterId },
        ],
      },
      include: adoptionInclude,
      orderBy: {
        adoptedAt: 'desc',
      },
    });
    return adoptions.map((adoption) => this.toModel(adoption));
  }
}