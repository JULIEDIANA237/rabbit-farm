import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';

import { CreateLitterInput } from './inputs/create-litter.input';
import { CreateLitterRabbitsInput } from './inputs/create-litter-rabbits.input';

import {
  RabbitSex,
  RabbitStatus,
} from '../generated/prisma/client';
import { AssignLitterRabbitsToCageInput } from './inputs/assign-litter-rabbits-to-cage.input';

@Injectable()
export class LittersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    input: CreateLitterInput,
    currentUser: CurrentUserType,
  ) {
    const code = input.code.trim().toUpperCase();

    if (!code) {
      throw new BadRequestException(
        'Le code de la portée est obligatoire.',
      );
    }

    const birth = await this.prisma.birth.findFirst({
      where: {
        id: input.birthId,
        farmId: currentUser.farmId,
      },
      include: {
        litter: true,
        breeding: {
          include: {
            female: true,
            male: true,
          },
        },
      },
    });

    if (!birth) {
      throw new NotFoundException(
        'Naissance introuvable.',
      );
    }

    if (birth.litter) {
      throw new ConflictException(
        'Une portée existe déjà pour cette naissance.',
      );
    }

    const existing = await this.prisma.litter.findFirst({
      where: {
        farmId: currentUser.farmId,
        code,
      },
    });

    if (existing) {
      throw new ConflictException(
        `La portée ${code} existe déjà.`,
      );
    }

    return this.prisma.litter.create({
      data: {
        farmId: currentUser.farmId,
        birthId: input.birthId,
        code,
        motherId: birth.motherId,
        birthDate: birth.birthDate,
        liveBorn: birth.liveBorn,
        stillBorn: birth.stillBorn,
        currentCount: birth.liveBorn,
        observation: input.observation?.trim() || null,
      },
    });
  }

  async findAll(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.litter.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const litter = await this.prisma.litter.findFirst({
      where: {
        id,
        farmId: currentUser.farmId,
      },
    });

    if (!litter) {
      throw new NotFoundException(
        'Portée introuvable.',
      );
    }

    return litter;
  }

  async findByBirth(
    birthId: string,
    currentUser: CurrentUserType,
  ) {
    const birth = await this.prisma.birth.findFirst({
      where: {
        id: birthId,
        farmId: currentUser.farmId,
      },
    });

    if (!birth) {
      throw new NotFoundException(
        'Naissance introuvable.',
      );
    }

    return this.prisma.litter.findFirst({
      where: {
        birthId,
        farmId: currentUser.farmId,
      },
    });
  }

  async createRabbits(
  input: CreateLitterRabbitsInput,
  currentUser: CurrentUserType,
) {
  if (input.numberOfRabbits <= 0) {
    throw new BadRequestException(
      'Le nombre de lapereaux doit être supérieur à zéro.',
    );
  }

  const litter = await this.prisma.litter.findFirst({
    where: {
      id: input.litterId,
      farmId: currentUser.farmId,
    },
    include: {
      birth: {
        include: {
          breeding: {
            include: {
              female: true,
              male: true,
            },
          },
        },
      },
      rabbits: true,
    },
  });

  if (!litter) {
    throw new NotFoundException(
      'Portée introuvable.',
    );
  }

  const birth = litter.birth;

  if (!birth) {
    throw new BadRequestException(
      'Cette portée ne possède pas de naissance associée.',
    );
  }

  const existingCount = litter.rabbits.length;

  if (
    existingCount + input.numberOfRabbits >
    birth.liveBorn
  ) {
    throw new BadRequestException(
      `Impossible de créer ${input.numberOfRabbits} lapereaux. ` +
      `La naissance contient ${birth.liveBorn} lapereaux vivants ` +
      `et ${existingCount} sont déjà enregistrés.`,
    );
  }

  if (
    input.sexes &&
    input.sexes.length !== input.numberOfRabbits
  ) {
    throw new BadRequestException(
      'Le nombre de sexes fournis doit correspondre au nombre de lapereaux à créer.',
    );
  }

  const female = birth.breeding.female;
  const male = birth.breeding.male;

  if (!female || !male) {
    throw new BadRequestException(
      'Les parents biologiques de la portée sont introuvables.',
    );
  }

  const startNumber = existingCount + 1;

  const rabbits: Array<{
    farmId: string;
    code: string;
    sex: RabbitSex;
    status: RabbitStatus;
    fatherId: string;
    motherId: string;
    birthDate: Date;
    birthLitterId: string;
  }> = [];

  for (
    let index = 0;
    index < input.numberOfRabbits;
    index++
  ) {
    const sequence = startNumber + index;

    const code =
      `${litter.code}-${String(sequence).padStart(2, '0')}`;

    const sex =
      input.sexes?.[index] ??
      RabbitSex.UNKNOWN;

    rabbits.push({
      farmId: currentUser.farmId,

      code,

      sex,

      status: RabbitStatus.ACTIVE,

      fatherId: male.id,
      motherId: female.id,

      birthDate: birth.birthDate,

      birthLitterId: litter.id,
    });
  }

  const created = await this.prisma.$transaction(
    async (tx) => {
      const result = [];

      for (const rabbitData of rabbits) {
        const rabbit = await tx.rabbit.create({
          data: rabbitData,
        });

        result.push(rabbit);
      }

      return result;
    },
  );

  return created;
}

async assignRabbitsToCage(
  input: AssignLitterRabbitsToCageInput,
  currentUser: CurrentUserType,
) {
  if (input.rabbitIds.length === 0) {
    throw new BadRequestException(
      'Au moins un lapereau doit être sélectionné.',
    );
  }

  const uniqueRabbitIds = [
    ...new Set(input.rabbitIds),
  ];

  if (
    uniqueRabbitIds.length !== input.rabbitIds.length
  ) {
    throw new BadRequestException(
      'Un même lapereau ne peut pas être sélectionné plusieurs fois.',
    );
  }

  const result = await this.prisma.$transaction(
    async (tx) => {
      /*
       * 1. Vérifier la portée
       */
      const litter = await tx.litter.findFirst({
        where: {
          id: input.litterId,
          farmId: currentUser.farmId,
        },
      });

      if (!litter) {
        throw new NotFoundException(
          'Portée introuvable.',
        );
      }

      /*
       * 2. Vérifier la cage
       */
      const cage = await tx.cage.findFirst({
        where: {
          id: input.cageId,
          farmId: currentUser.farmId,
        },
      });

      if (!cage) {
        throw new NotFoundException(
          'Cage introuvable.',
        );
      }

      if (cage.status !== 'ACTIVE') {
        throw new BadRequestException(
          'Cette cage n’est pas active.',
        );
      }

      /*
       * 3. Vérifier que tous les lapereaux
       *    appartiennent bien à cette portée.
       */
      const rabbits = await tx.rabbit.findMany({
        where: {
          id: {
            in: uniqueRabbitIds,
          },
          farmId: currentUser.farmId,
          birthLitterId: litter.id,
          status: 'ACTIVE',
        },
      });

      if (rabbits.length !== uniqueRabbitIds.length) {
        throw new BadRequestException(
          'Un ou plusieurs lapereaux n’appartiennent pas à cette portée, sont introuvables ou ne sont plus actifs.',
        );
      }

      /*
       * 4. Vérifier qu'ils ne sont pas déjà
       *    dans une cage.
       */
      const existingMovements =
        await tx.rabbitCageMovement.findMany({
          where: {
            rabbitId: {
              in: uniqueRabbitIds,
            },
            endedAt: null,
          },
        });

      if (existingMovements.length > 0) {
        throw new BadRequestException(
          'Un ou plusieurs lapereaux sont déjà affectés à une cage.',
        );
      }

      /*
       * 5. Vérifier la capacité de la cage.
       */
      const currentOccupancy =
        await tx.rabbitCageMovement.count({
          where: {
            cageId: cage.id,
            endedAt: null,
          },
        });

      const availableCapacity =
        cage.capacity - currentOccupancy;

      if (
        uniqueRabbitIds.length >
        availableCapacity
      ) {
        throw new BadRequestException(
          `Capacité insuffisante. ` +
          `La cage contient actuellement ${currentOccupancy} lapin(s) ` +
          `sur une capacité de ${cage.capacity}. ` +
          `Il reste ${availableCapacity} place(s).`,
        );
      }

      /*
       * 6. Créer un mouvement pour chaque lapereau.
       */
      const startedAt = new Date();

      const movements = [];

      for (const rabbitId of uniqueRabbitIds) {
        const movement =
          await tx.rabbitCageMovement.create({
            data: {
              rabbitId,
              cageId: cage.id,
              startedAt,
              reason:
                input.reason?.trim() ||
                'INITIAL_ASSIGNMENT',
              observation:
                input.observation?.trim() || null,
            },
          });

        movements.push(movement);
      }

      return movements;
    },
  );

  return result;
}
}