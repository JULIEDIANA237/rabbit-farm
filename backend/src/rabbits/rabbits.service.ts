import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  RabbitIdentificationType,
  RabbitStatus,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import type { CurrentUserType } from '../auth/types/current-user.type';

import { AddRabbitIdentificationInput } from './inputs/add-rabbit-identification.input';
import { CreateRabbitInput } from './inputs/create-rabbit.input';
import { MoveRabbitInput } from './inputs/move-rabbit.input';
import { UpdateRabbitInput } from './inputs/update-rabbit.input';

@Injectable()
export class RabbitsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findRabbitOrFail(
    id: string,
    farmId: string,
  ) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id, farmId },
      include: { identifications: true },
    });

    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }

    return rabbit;
  }

  private async validateParents(
    parentIds: Array<string | undefined>,
    farmId: string,
  ) {
    const ids = parentIds.filter(
      (id): id is string => Boolean(id),
    );

    if (ids.length === 0) {
      return;
    }

    const parents = await this.prisma.rabbit.findMany({
      where: {
        id: { in: ids },
        farmId,
      },
      select: { id: true },
    });

    const existingIds = new Set(
      parents.map((parent) => parent.id),
    );
    const missingId = ids.find(
      (id) => !existingIds.has(id),
    );

    if (missingId) {
      throw new NotFoundException(
        `Le lapin parent ${missingId} est introuvable dans cette ferme.`,
      );
    }
  }

  async findAll(currentUser: CurrentUserType) {
    return this.prisma.rabbit.findMany({
      where: { farmId: currentUser.farmId },
      include: { identifications: true },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    return this.findRabbitOrFail(id, currentUser.farmId);
  }

  async create(
    input: CreateRabbitInput,
    currentUser: CurrentUserType,
  ) {
    const code = input.code.trim();

    if (!code) {
      throw new ConflictException('Le code du lapin est obligatoire.');
    }

    const existing = await this.prisma.rabbit.findUnique({
      where: {
        farmId_code: {
          farmId: currentUser.farmId,
          code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Un lapin portant ce code existe déjà dans cette ferme.',
      );
    }

    await this.validateParents(
      [input.fatherId, input.motherId],
      currentUser.farmId,
    );

    return this.prisma.rabbit.create({
      data: {
        farmId: currentUser.farmId,
        code,
        sex: input.sex,
        breedId: input.breedId,
        crossBreedId: input.crossBreedId,
        fatherId: input.fatherId,
        motherId: input.motherId,
        birthDate: input.birthDate,
        geneticType: input.geneticType,
        color: input.color,
        weight: input.weight,
        observation: input.observations,
      },
      include: { identifications: true },
    });
  }

  async update(
    input: UpdateRabbitInput,
    currentUser: CurrentUserType,
  ) {
    await this.findRabbitOrFail(input.id, currentUser.farmId);

    if (input.code !== undefined) {
      const code = input.code.trim();

      if (!code) {
        throw new ConflictException('Le code du lapin est obligatoire.');
      }

      const existing = await this.prisma.rabbit.findFirst({
        where: {
          farmId: currentUser.farmId,
          code,
          NOT: { id: input.id },
        },
      });

      if (existing) {
        throw new ConflictException(
          'Un lapin portant ce code existe déjà dans cette ferme.',
        );
      }
    }

    return this.prisma.rabbit.update({
      where: { id: input.id },
      data: {
        code: input.code?.trim(),
        status: input.status ?? RabbitStatus.ACTIVE,
        breedId: input.breedId,
        crossBreedId: input.crossBreedId,
        color: input.color,
        weight: input.weight,
        observation: input.observations,
      },
      include: { identifications: true },
    });
  }

  async addIdentification(
    rabbitId: string,
    input: AddRabbitIdentificationInput,
    currentUser: CurrentUserType,
  ) {
    await this.findRabbitOrFail(rabbitId, currentUser.farmId);

    const value = input.value.trim();

    if (!value) {
      throw new ConflictException("La valeur de l'identification est obligatoire.");
    }

    try {
      return await this.prisma.rabbitIdentification.create({
        data: {
          rabbitId,
          type: input.type,
          value,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.constructor.name === 'PrismaClientKnownRequestError') {
        throw new ConflictException('Cette identification existe déjà.');
      }

      throw error;
    }
  }

  async getIdentifications(
    rabbitId: string,
    currentUser: CurrentUserType,
  ) {
    await this.findRabbitOrFail(rabbitId, currentUser.farmId);

    return this.prisma.rabbitIdentification.findMany({
      where: { rabbitId },
      orderBy: { createdAt: 'asc' },
    });
  }

    async moveRabbit(
    input: MoveRabbitInput,
    currentUser: CurrentUserType,
    ) {
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
        // 1. Vérifier que le lapin appartient à la ferme
        const rabbit = await tx.rabbit.findFirst({
        where: {
            id: input.rabbitId,
            farmId: currentUser.farmId,
        },
        });

        if (!rabbit) {
        throw new NotFoundException('Lapin introuvable.');
        }

        if (rabbit.status !== 'ACTIVE') {
        throw new BadRequestException(
            'Seul un lapin actif peut être déplacé.',
        );
        }

        // 2. Vérifier que la cage appartient à la ferme
        const cage = await tx.cage.findFirst({
        where: {
            id: input.cageId,
            farmId: currentUser.farmId,
        },
        });

        if (!cage) {
        throw new NotFoundException('Cage introuvable.');
        }

        if (cage.status !== 'ACTIVE') {
        throw new BadRequestException(
            'Le lapin ne peut pas être placé dans une cage inactive ou en maintenance.',
        );
        }

        // 3. Récupérer l'emplacement actuel du lapin
        const currentMovement =
        await tx.rabbitCageMovement.findFirst({
            where: {
            rabbitId: rabbit.id,
            endedAt: null,
            },
            orderBy: {
            startedAt: 'desc',
            },
        });

        // 4. Éviter un déplacement vers la même cage
        if (currentMovement?.cageId === cage.id) {
        throw new BadRequestException(
            'Le lapin se trouve déjà dans cette cage.',
        );
        }

        // 5. Vérifier la capacité de la cage destination
        const rabbitCount =
        await tx.rabbitCageMovement.count({
            where: {
            cageId: cage.id,
            endedAt: null,
            },
        });

        if (rabbitCount >= cage.capacity) {
        throw new BadRequestException(
          `La cage ${cage.code} est pleine (${rabbitCount}/${cage.capacity}).`,
        );
        }

        // 6. Fermer l'ancien mouvement
        if (currentMovement) {
        await tx.rabbitCageMovement.update({
            where: {
            id: currentMovement.id,
            },
            data: {
            endedAt: now,
            },
        });
        }

        // 7. Créer le nouveau mouvement
        return tx.rabbitCageMovement.create({
        data: {
            rabbitId: rabbit.id,
            cageId: cage.id,
            startedAt: now,
            reason: input.reason?.trim() || null,
            observation: input.observation?.trim() || null,
        },
        });
    }, {
      maxWait: 10_000,
      timeout: 20_000,
    });
  }

    async getRabbitCageMovements(
    rabbitId: string,
    currentUser: CurrentUserType,
    ) {
    const rabbit = await this.prisma.rabbit.findFirst({
        where: {
        id: rabbitId,
        farmId: currentUser.farmId,
        },
        select: {
        id: true,
        },
    });

    if (!rabbit) {
        throw new NotFoundException('Lapin introuvable.');
    }

    return this.prisma.rabbitCageMovement.findMany({
        where: {
        rabbitId,
        },
        orderBy: {
        startedAt: 'desc',
        },
    });
    }
}