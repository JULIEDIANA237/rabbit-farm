import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CageStatus } from '../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CurrentUserType } from '../auth/types/current-user.type';

import { CreateCageInput } from './inputs/create-cage.input';
import { UpdateCageInput } from './inputs/update-cage.input';

@Injectable()
export class CagesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private toCageModel<T extends { rabbitMovements: unknown[] }>(
    cage: T,
  ) {
    const { rabbitMovements, ...cageData } = cage;

    return {
      ...cageData,
      rabbitCount: rabbitMovements.length,
    };
  }

  /**
   * Vérifie qu'une section appartient
   * bien à la ferme courante.
   */
  private async getSectionForFarm(
    sectionId: string,
    farmId: string,
  ) {
    const section =
      await this.prisma.section.findFirst({
        where: {
          id: sectionId,
          farmId,
        },
      });

    if (!section) {
      throw new NotFoundException(
        'Section introuvable dans cette ferme.',
      );
    }

    return section;
  }

  /**
   * Création d'une cage.
   */
  async create(
    input: CreateCageInput,
    currentUser: CurrentUserType,
  ) {
    const code = input.code.trim();

    if (!code) {
      throw new BadRequestException(
        'Le nom de la cage est obligatoire.',
      );
    }

    if (input.capacity <= 0) {
      throw new BadRequestException(
        'La capacité de la cage doit être supérieure à zéro.',
      );
    }

    /**
     * Vérifie que la section appartient
     * à la ferme courante.
     */
    await this.getSectionForFarm(
      input.sectionId,
      currentUser.farmId,
    );

    /**
     * Vérifie l'unicité du nom dans la ferme.
     */
    const existing =
      await this.prisma.cage.findUnique({
        where: {
          farmId_code: {
            farmId: currentUser.farmId,
            code,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Une cage portant ce nom existe déjà dans cette ferme.',
      );
    }

    const cage = await this.prisma.cage.create({
      data: {
        farmId: currentUser.farmId,
        sectionId: input.sectionId,
        code,
        capacity: input.capacity,
        status:
          input.status ?? CageStatus.ACTIVE,
        type: input.type,
      },

      include: {
        rabbitMovements: {
          where: {
            endedAt: null,
          },
        },
      },
    });

    return this.toCageModel(cage);
  }

  /**
   * Liste toutes les cages de la ferme courante.
   */
  async findAll(
    currentUser: CurrentUserType,
  ) {
    const cages =
      await this.prisma.cage.findMany({
        where: {
          farmId: currentUser.farmId,
        },

        include: {
          rabbitMovements: {
            where: {
              endedAt: null,
            },

            select: {
              rabbitId: true,
            },
          },
        },

        orderBy: {
          code: 'asc',
        },
      });

    return cages.map((cage) => ({
      ...cage,
      rabbitCount:
        cage.rabbitMovements.length,
    }));
  }

  /**
   * Récupère une cage précise.
   */
  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const cage =
      await this.prisma.cage.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },

        include: {
          rabbitMovements: {
            where: {
              endedAt: null,
            },

            select: {
              rabbitId: true,
            },
          },
        },
      });

    if (!cage) {
      throw new NotFoundException(
        'Cage introuvable.',
      );
    }

    return {
      ...cage,
      rabbitCount:
        cage.rabbitMovements.length,
    };
  }

  /**
   * Modification d'une cage.
   */
  async update(
    input: UpdateCageInput,
    currentUser: CurrentUserType,
  ) {
    const cage =
      await this.prisma.cage.findFirst({
        where: {
          id: input.id,
          farmId: currentUser.farmId,
        },

        include: {
          rabbitMovements: {
            where: {
              endedAt: null,
            },
          },
        },
      });

    if (!cage) {
      throw new NotFoundException(
        'Cage introuvable.',
      );
    }

    /**
     * Vérifie le nouveau nom.
     */
    if (input.code !== undefined) {
      const code = input.code.trim();

      if (!code) {
        throw new BadRequestException(
          'Le nom de la cage est obligatoire.',
        );
      }

      const existing =
        await this.prisma.cage.findFirst({
          where: {
            farmId: currentUser.farmId,
            code,
            NOT: {
              id: input.id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Une autre cage porte déjà ce nom.',
        );
      }
    }

    /**
     * Vérifie la nouvelle section.
     */
    if (input.sectionId !== undefined) {
      await this.getSectionForFarm(
        input.sectionId,
        currentUser.farmId,
      );
    }

    /**
     * Une capacité ne peut pas être
     * inférieure au nombre actuel de lapins.
     */
    if (
      input.capacity !== undefined &&
      input.capacity <
        cage.rabbitMovements.length
    ) {
      throw new ConflictException(
        `La capacité ne peut pas être inférieure au nombre actuel de lapins (${cage.rabbitMovements.length}).`,
      );
    }

    const updatedCage = await this.prisma.cage.update({
      where: {
        id: cage.id,
      },

      data: {
        code:
          input.code !== undefined
            ? input.code.trim()
            : undefined,

        sectionId:
          input.sectionId,

        capacity:
          input.capacity,

        status:
          input.status,

        type:
          input.type,
      },

      include: {
        rabbitMovements: {
          where: {
            endedAt: null,
          },
        },
      },
    });

    return this.toCageModel(updatedCage);
  }

  /**
   * Suppression d'une cage.
   */
  async remove(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const cage =
      await this.prisma.cage.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },

        include: {
          rabbitMovements: {
            where: {
              endedAt: null,
            },
          },
        },
      });

    if (!cage) {
      throw new NotFoundException(
        'Cage introuvable.',
      );
    }

    /**
     * Une cage occupée ne peut pas être supprimée.
     */
    if (cage.rabbitMovements.length > 0) {
      throw new ConflictException(
        'Impossible de supprimer une cage contenant encore des lapins.',
      );
    }

    const deletedCage = await this.prisma.cage.delete({
      where: {
        id: cage.id,
      },
    });

    return {
      ...deletedCage,
      rabbitCount: 0,
    };
  }
}