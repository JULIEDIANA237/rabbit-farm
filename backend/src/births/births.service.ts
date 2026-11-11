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
  PregnancyResult,
  RabbitPurpose,
  RabbitSex,
  RabbitStatus,
} from '../generated/prisma/client.js';

import { CreateBirthInput } from './inputs/create-birth.input.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';
import { formatKitCode, nextLitterCode } from '../common/utils/codes.js';

const birthInclude = {
  mother: true,
  breeding: { include: { male: true } },
  litter: { select: { id: true, code: true } },
} as const;

type BirthWithRelations = {
  breeding?: { male?: unknown } | null;
  litter?: { id: string; code: string } | null;
  [key: string]: unknown;
};

@Injectable()
export class BirthsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasks: TaskAutomationService,
  ) {}

  private toModel<T extends BirthWithRelations>(birth: T) {
    return {
      ...birth,
      father: birth.breeding?.male ?? null,
      litterId: birth.litter?.id ?? null,
      litterCode: birth.litter?.code ?? null,
    };
  }

  /**
   * Mise bas (§26) : enregistre la naissance, crée la portée (§27)
   * et, si demandé, les lapereaux individuels L001-01… (§12, §28).
   */
  async create(
    input: CreateBirthInput,
    currentUser: CurrentUserType,
  ) {
    if (!Number.isInteger(input.liveBorn) || input.liveBorn < 0) {
      throw new BadRequestException(
        'Le nombre de lapereaux vivants ne peut pas être négatif.',
      );
    }

    if (!Number.isInteger(input.stillBorn) || input.stillBorn < 0) {
      throw new BadRequestException(
        'Le nombre de mort-nés ne peut pas être négatif.',
      );
    }

    if (input.liveBorn + input.stillBorn === 0) {
      throw new BadRequestException(
        'La naissance doit comporter au moins un lapereau.',
      );
    }

    const breeding = await this.prisma.breeding.findFirst({
      where: {
        id: input.breedingId,
        farmId: currentUser.farmId,
      },
      include: {
        pregnancies: {
          orderBy: { checkDate: 'desc' },
          take: 1,
        },
        birth: true,
        female: true,
        male: true,
      },
    });

    if (!breeding) {
      throw new NotFoundException('Accouplement introuvable.');
    }

    if (breeding.birth) {
      throw new BadRequestException(
        'Une naissance est déjà enregistrée pour cet accouplement.',
      );
    }

    if (breeding.status === BreedingStatus.CANCELLED) {
      throw new BadRequestException(
        "Impossible d'enregistrer une naissance pour un accouplement annulé.",
      );
    }

    if (
      breeding.pregnancies.length === 0 ||
      breeding.pregnancies[0].result !== PregnancyResult.PREGNANT
    ) {
      throw new BadRequestException(
        "La gestation doit être confirmée avant d'enregistrer la naissance.",
      );
    }

    const birthDate = new Date(input.birthDate);

    if (Number.isNaN(birthDate.getTime())) {
      throw new BadRequestException('La date de naissance est invalide.');
    }

    if (birthDate < breeding.breedingDate) {
      throw new BadRequestException(
        'La date de naissance ne peut pas être antérieure à la saillie.',
      );
    }

    // Code de portée : fourni ou généré.
    let litterCode = input.litterCode?.trim().toUpperCase();

    if (!litterCode) {
      const existing = await this.prisma.litter.findMany({
        where: { farmId: currentUser.farmId },
        select: { code: true },
      });
      litterCode = nextLitterCode(existing.map((litter) => litter.code));
    } else {
      const duplicate = await this.prisma.litter.findFirst({
        where: { farmId: currentUser.farmId, code: litterCode },
        select: { id: true },
      });

      if (duplicate) {
        throw new ConflictException(`La portée ${litterCode} existe déjà.`);
      }
    }

    const createKits = input.createKits ?? true;

    const birth = await this.prisma.$transaction(async (tx) => {
      const createdBirth = await tx.birth.create({
        data: {
          farmId: currentUser.farmId,
          breedingId: breeding.id,
          motherId: breeding.femaleId,
          birthDate,
          liveBorn: input.liveBorn,
          stillBorn: input.stillBorn,
          observation: input.observation?.trim() || null,
        },
      });

      await tx.breeding.update({
        where: { id: breeding.id },
        data: { status: BreedingStatus.BIRTH_RECORDED },
      });

      if (input.liveBorn > 0) {
        const litter = await tx.litter.create({
          data: {
            farmId: currentUser.farmId,
            code: litterCode,
            breedingId: breeding.id,
            birthId: createdBirth.id,
            motherId: breeding.femaleId,
            fatherId: breeding.maleId,
            birthDate,
            liveBorn: input.liveBorn,
            stillBorn: input.stillBorn,
            currentCount: input.liveBorn,
            observation: input.observation?.trim() || null,
          },
        });

        if (createKits) {
          await tx.rabbit.createMany({
            data: Array.from({ length: input.liveBorn }, (_, index) => ({
              farmId: currentUser.farmId,
              code: formatKitCode(litter.code, index + 1),
              sex: RabbitSex.UNKNOWN,
              status: RabbitStatus.ACTIVE,
              purpose: RabbitPurpose.FATTENING,
              fatherId: breeding.maleId,
              motherId: breeding.femaleId,
              birthDate,
              birthLitterId: litter.id,
              breedId:
                breeding.female.breedId === breeding.male.breedId
                  ? breeding.female.breedId
                  : null,
            })),
          });
        }
      }

      await this.tasks.onBirthRecorded(
        currentUser.farmId,
        {
          id: createdBirth.id,
          breedingId: breeding.id,
          birthDate,
          motherId: breeding.femaleId,
          motherCode: breeding.female.code,
          liveBorn: input.liveBorn,
          litterCode: input.liveBorn > 0 ? litterCode : null,
        },
        tx,
      );

      return tx.birth.findUniqueOrThrow({
        where: { id: createdBirth.id },
        include: birthInclude,
      });
    });

    return this.toModel(birth);
  }

  async findAll(
    currentUser: CurrentUserType,
  ) {
    const births = await this.prisma.birth.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      include: birthInclude,
      orderBy: {
        birthDate: 'desc',
      },
    });

    return births.map((birth) => this.toModel(birth));
  }

  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const birth = await this.prisma.birth.findFirst({
      where: {
        id,
        farmId: currentUser.farmId,
      },
      include: birthInclude,
    });

    if (!birth) {
      throw new NotFoundException('Naissance introuvable.');
    }

    return this.toModel(birth);
  }
}
