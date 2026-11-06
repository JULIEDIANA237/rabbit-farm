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
import { formatKitCode } from '../common/utils/codes';

const litterInclude = {
  mother: true,
  father: true,
  _count: { select: { rabbits: true } },
} as const;

type LitterWithCount = {
  _count?: { rabbits: number };
  [key: string]: unknown;
};

@Injectable()
export class LittersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private toModel<T extends LitterWithCount>(litter: T) {
    const { _count, ...rest } = litter;
    return {
      ...rest,
      kitCount: _count?.rabbits ?? 0,
    };
  }

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

    const litter = await this.prisma.litter.create({
      include: litterInclude,
      data: {
        farmId: currentUser.farmId,
        birthId: input.birthId,
        breedingId: birth.breedingId,
        fatherId: birth.breeding.maleId,
        code,
        motherId: birth.motherId,
        birthDate: birth.birthDate,
        liveBorn: birth.liveBorn,
        stillBorn: birth.stillBorn,
        currentCount: birth.liveBorn,
        observation: input.observation?.trim() || null,
      },
    });

    return this.toModel(litter);
  }

  async findAll(
    currentUser: CurrentUserType,
  ) {
    const litters = await this.prisma.litter.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      include: litterInclude,
      orderBy: {
        birthDate: 'desc',
      },
    });

    return litters.map((litter) => this.toModel(litter));
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

    const litter = await this.prisma.litter.findFirst({
      where: {
        birthId,
        farmId: currentUser.farmId,
      },
      include: litterInclude,
    });
    return litter ? this.toModel(litter) : null;
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

    const code = formatKitCode(litter.code, sequence);

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

  /**
   * Traçabilité complète d'une portée (§55) : parents, lapereaux,
   * cages actuelles, adoptions, mortalités, sevrages et ventes.
   */
  async detail(id: string, currentUser: CurrentUserType) {
    const litter = await this.findOne(id, currentUser);

    const [kits, adoptions, mortalities, weanings] = await Promise.all([
      this.prisma.rabbit.findMany({
        where: { farmId: currentUser.farmId, birthLitterId: id },
        include: {
          cageMovements: {
            where: { endedAt: null },
            include: { cage: { select: { id: true, code: true } } },
            take: 1,
          },
          lotMemberships: {
            where: { leftAt: null },
            include: { lot: { select: { code: true } } },
            take: 1,
          },
          adoptionHistory: {
            include: {
              adoption: {
                include: { destinationLitter: { select: { code: true } } },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          saleItems: {
            include: { sale: { select: { id: true, saleDate: true, status: true } } },
          },
        },
        orderBy: { code: 'asc' },
      }),
      this.prisma.litterAdoption.findMany({
        where: {
          farmId: currentUser.farmId,
          OR: [{ sourceLitterId: id }, { destinationLitterId: id }],
        },
        include: {
          sourceLitter: { select: { code: true } },
          destinationLitter: { select: { code: true } },
        },
      }),
      this.prisma.mortalityRecord.findMany({
        where: { farmId: currentUser.farmId, litterId: id },
      }),
      this.prisma.weaning.findMany({
        where: { farmId: currentUser.farmId, litterId: id },
      }),
    ]);

    const distribution = new Map<string, { cageId: string; cageCode: string; count: number }>();

    for (const kit of kits) {
      const cage = kit.cageMovements[0]?.cage;
      if (!cage || kit.status !== RabbitStatus.ACTIVE) continue;
      const entry = distribution.get(cage.id) ?? {
        cageId: cage.id,
        cageCode: cage.code,
        count: 0,
      };
      entry.count += 1;
      distribution.set(cage.id, entry);
    }

    const events: Array<{
      id: string;
      type: string;
      date: Date;
      label: string;
      quantity?: number | null;
      weight?: number | null;
    }> = [];

    for (const adoption of adoptions) {
      const outgoing = adoption.sourceLitterId === id;
      events.push({
        id: adoption.id,
        type: outgoing ? 'ADOPTION_OUT' : 'ADOPTION_IN',
        date: adoption.adoptedAt,
        quantity: adoption.quantity,
        label: outgoing
          ? `${adoption.quantity} lapereau(x) confié(s) à ${adoption.destinationLitter.code}`
          : `${adoption.quantity} lapereau(x) reçu(s) de ${adoption.sourceLitter.code}`,
      });
    }

    for (const mortality of mortalities) {
      events.push({
        id: mortality.id,
        type: 'MORTALITY',
        date: mortality.date,
        quantity: mortality.count,
        label: `${mortality.count} mort(s)${mortality.cause ? ` : ${mortality.cause}` : ''}`,
      });
    }

    for (const weaning of weanings) {
      events.push({
        id: weaning.id,
        type: weaning.actualDate ? 'WEANING' : 'WEANING_PLANNED',
        date: weaning.actualDate ?? weaning.plannedDate,
        quantity: weaning.quantity,
        weight: weaning.totalWeight != null ? Number(weaning.totalWeight) : null,
        label: weaning.actualDate
          ? `${weaning.quantity} lapereau(x) sevré(s)`
          : `Sevrage prévu de ${weaning.quantity} lapereau(x)`,
      });
    }

    const soldKits = kits.filter((kit) => kit.status === RabbitStatus.SOLD);
    for (const kit of soldKits) {
      const sale = kit.saleItems[0]?.sale;
      if (!sale) continue;
      events.push({
        id: `${sale.id}-${kit.id}`,
        type: 'SALE',
        date: sale.saleDate,
        quantity: 1,
        label: `${kit.code} vendu`,
      });
    }

    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    const deaths = mortalities.reduce((sum, m) => sum + m.count, 0);
    const weaned = weanings
      .filter((weaning) => weaning.actualDate)
      .reduce((sum, weaning) => sum + weaning.quantity, 0);

    return {
      litter,
      kits: kits.map((kit) => {
        const adoption = kit.adoptionHistory[0]?.adoption;
        return {
          id: kit.id,
          code: kit.code,
          originalCode: kit.originalCode,
          sex: kit.sex,
          status: kit.status,
          currentCageId: kit.cageMovements[0]?.cage.id ?? null,
          currentCageCode: kit.cageMovements[0]?.cage.code ?? null,
          currentLotCode: kit.lotMemberships[0]?.lot.code ?? null,
          rearingLitterCode:
            adoption && adoption.destinationLitterId !== id
              ? adoption.destinationLitter.code
              : null,
        };
      }),
      cageDistribution: [...distribution.values()].sort((a, b) =>
        a.cageCode.localeCompare(b.cageCode),
      ),
      events,
      deaths,
      weaned,
      sold: soldKits.length,
      survivalRate:
        litter.liveBorn > 0
          ? Number((((litter.liveBorn - deaths) / litter.liveBorn) * 100).toFixed(1))
          : null,
    };
  }
}