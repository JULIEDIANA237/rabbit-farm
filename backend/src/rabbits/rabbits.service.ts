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

  private async isDescendant(
    possibleDescendantId: string,
    ancestorId: string,
    currentUser: CurrentUserType,
    visited = new Set<string>(),
  ): Promise<boolean> {
    if (possibleDescendantId === ancestorId) {
      return true;
    }

    if (visited.has(possibleDescendantId)) {
      return false;
    }

    visited.add(possibleDescendantId);

    const rabbit = await this.prisma.rabbit.findFirst({
      where: {
        id: possibleDescendantId,
        farmId: currentUser.farmId,
      },
      select: {
        fatherId: true,
        motherId: true,
      },
    });

    if (!rabbit) {
      return false;
    }

    if (
      rabbit.fatherId &&
      (await this.isDescendant(
        rabbit.fatherId,
        ancestorId,
        currentUser,
        visited,
      ))
    ) {
      return true;
    }

    if (
      rabbit.motherId &&
      (await this.isDescendant(
        rabbit.motherId,
        ancestorId,
        currentUser,
        visited,
      ))
    ) {
      return true;
    }

    return false;
  }

  private async collectAncestors(
    rabbitId: string,
    currentUser: CurrentUserType,
    visited = new Set<string>(),
  ): Promise<Set<string>> {
    if (visited.has(rabbitId)) {
      return visited;
    }

    visited.add(rabbitId);

    const rabbit = await this.prisma.rabbit.findFirst({
      where: {
        id: rabbitId,
        farmId: currentUser.farmId,
      },
      select: {
        fatherId: true,
        motherId: true,
      },
    });

    if (!rabbit) {
      return visited;
    }

    if (rabbit.fatherId) {
      await this.collectAncestors(
        rabbit.fatherId,
        currentUser,
        visited,
      );
    }

    if (rabbit.motherId) {
      await this.collectAncestors(
        rabbit.motherId,
        currentUser,
        visited,
      );
    }

    return visited;
  }

  private async validateGenealogy(
    rabbitId: string | undefined,
    fatherId: string | undefined,
    motherId: string | undefined,
    currentUser: CurrentUserType,
  ) {
    if (!fatherId && !motherId) {
      return;
    }

    if (!fatherId || !motherId) {
      throw new BadRequestException(
        'Le père et la mère doivent être renseignés ensemble.',
      );
    }

    if (fatherId === motherId) {
      throw new BadRequestException(
        'Le père et la mère doivent être deux lapins différents.',
      );
    }

    if (rabbitId && (rabbitId === fatherId || rabbitId === motherId)) {
      throw new BadRequestException(
        'Un lapin ne peut pas être son propre parent.',
      );
    }

    if (rabbitId && fatherId && motherId) {
      const fatherWouldBecomeDescendant =
        await this.isDescendant(
          fatherId,
          rabbitId,
          currentUser,
        );

      const motherWouldBecomeDescendant =
        await this.isDescendant(
          motherId,
          rabbitId,
          currentUser,
        );

      if (
        fatherWouldBecomeDescendant ||
        motherWouldBecomeDescendant
      ) {
        throw new BadRequestException(
          'Cette filiation créerait un cycle généalogique interdit.',
        );
      }
    }

    const parents = await this.prisma.rabbit.findMany({
      where: {
        farmId: currentUser.farmId,
        id: {
          in: [fatherId, motherId],
        },
      },
    });

    if (parents.length !== 2) {
      throw new BadRequestException(
        "Le père ou la mère n'appartient pas à cette ferme.",
      );
    }

    const father = parents.find(
      (parent) => parent.id === fatherId,
    );

    const mother = parents.find(
      (parent) => parent.id === motherId,
    );

    if (!father || !mother) {
      throw new BadRequestException(
        'Impossible de retrouver les deux parents.',
      );
    }

    if (father.sex !== 'MALE') {
      throw new BadRequestException(
        'Le parent déclaré comme père doit être un mâle.',
      );
    }

    if (mother.sex !== 'FEMALE') {
      throw new BadRequestException(
        'Le parent déclaré comme mère doit être une femelle.',
      );
    }

    if (father.status !== 'ACTIVE' || mother.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Les deux parents doivent être actifs.',
      );
    }
  }

  async detectCommonAncestors(
    rabbitAId: string,
    rabbitBId: string,
    currentUser: CurrentUserType,
  ) {
    const ancestorsA = await this.collectAncestors(
      rabbitAId,
      currentUser,
    );

    const ancestorsB = await this.collectAncestors(
      rabbitBId,
      currentUser,
    );

    return [...ancestorsA].filter((id) =>
      ancestorsB.has(id),
    );
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

    await this.validateGenealogy(
      undefined,
      input.fatherId,
      input.motherId,
      currentUser,
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
        observations: input.observations,
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
        observations: input.observations,
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