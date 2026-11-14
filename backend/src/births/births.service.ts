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
  TaskSourceType,
} from '../generated/prisma/client.js';

import { CreateBirthInput } from './inputs/create-birth.input.js';
import { UpdateBirthInput } from './inputs/update-birth.input.js';
import { rabbitDeletionBlockers } from '../common/utils/rabbit-history.js';
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

  async update(input: UpdateBirthInput, currentUser: CurrentUserType) {
    const birth = await this.prisma.birth.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
      include: {
        breeding: true,
        mother: { select: { code: true } },
        litter: { include: { weanings: { select: { id: true } } } },
      },
    });
    if (!birth) {
      throw new NotFoundException('Naissance introuvable.');
    }
    const birthDate = input.birthDate ? new Date(input.birthDate) : birth.birthDate;
    if (Number.isNaN(birthDate.getTime())) {
      throw new BadRequestException('La date de naissance est invalide.');
    }
    if (birthDate < birth.breeding.breedingDate) {
      throw new BadRequestException(
        'La date de naissance ne peut pas être antérieure à la saillie.',
      );
    }
    if (input.stillBorn != null && (!Number.isInteger(input.stillBorn) || input.stillBorn < 0)) {
      throw new BadRequestException('Le nombre de mort-nés ne peut pas être négatif.');
    }
    const observation =
      input.observation === undefined ? undefined : input.observation.trim() || null;
    const dateChanged = birthDate.getTime() !== birth.birthDate.getTime();

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.birth.update({
        where: { id: birth.id },
        data: { birthDate, stillBorn: input.stillBorn ?? undefined, observation },
      });
      if (birth.litter) {
        await tx.litter.update({
          where: { id: birth.litter.id },
          data: { birthDate, stillBorn: input.stillBorn ?? undefined, observation },
        });
        if (dateChanged) {
          await tx.rabbit.updateMany({
            where: { birthLitterId: birth.litter.id, birthDate: birth.birthDate },
            data: { birthDate },
          });
        }
      }
      if (dateChanged && !birth.litter?.weanings.length) {
        await this.tasks.onBirthChanged(
          currentUser.farmId,
          {
            id: birth.id,
            breedingId: birth.breedingId,
            birthDate,
            motherId: birth.motherId,
            motherCode: birth.mother.code,
            liveBorn: birth.liveBorn,
            litterCode: birth.litter?.code ?? null,
          },
          birth.id,
          tx,
        );
      }
      return tx.birth.findUniqueOrThrow({ where: { id: birth.id }, include: birthInclude });
    });
    return this.toModel(updated);
  }

  /**
   * Supprime une mise bas saisie par erreur, avec sa portée et ses
   * lapereaux, tant qu'aucun historique n'y est rattaché.
   * L'accouplement redevient « gestante ».
   */
  async remove(id: string, currentUser: CurrentUserType) {
    const birth = await this.prisma.birth.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: {
        litter: {
          include: {
            rabbits: { select: { id: true } },
            weanings: { select: { id: true } },
            sourceAdoptions: { select: { id: true } },
            destinationAdoptions: { select: { id: true } },
            mortalities: { select: { id: true } },
          },
        },
      },
    });
    if (!birth) {
      throw new NotFoundException('Naissance introuvable.');
    }
    const litter = birth.litter;
    if (litter?.weanings.length) {
      throw new ConflictException('La portée est déjà sevrée : supprime d’abord le sevrage.');
    }
    if (litter && (litter.sourceAdoptions.length || litter.destinationAdoptions.length)) {
      throw new ConflictException('La portée a des adoptions enregistrées : impossible de la supprimer.');
    }
    if (litter?.mortalities.length) {
      throw new ConflictException('Des décès sont enregistrés pour cette portée : impossible de la supprimer.');
    }
    const kitIds = litter?.rabbits.map((rabbit) => rabbit.id) ?? [];
    const blockers = await rabbitDeletionBlockers(this.prisma, kitIds);
    if (blockers.length) {
      throw new ConflictException(
        `Les lapereaux ont déjà ${blockers.join(', ')} : impossible de supprimer la mise bas.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      if (kitIds.length) {
        await tx.task.deleteMany({ where: { rabbitId: { in: kitIds } } });
        await tx.rabbit.deleteMany({ where: { id: { in: kitIds } } });
      }
      if (litter) {
        await tx.litter.delete({ where: { id: litter.id } });
      }
      await this.tasks.onBirthChanged(currentUser.farmId, null, birth.id, tx);
      await tx.birth.delete({ where: { id: birth.id } });
      await tx.breeding.update({
        where: { id: birth.breedingId },
        data: { status: BreedingStatus.PREGNANT },
      });
      // Les tâches « surveiller la mise bas » redeviennent à faire.
      await tx.task.updateMany({
        where: {
          farmId: currentUser.farmId,
          sourceType: TaskSourceType.BREEDING,
          sourceId: birth.breedingId,
          automationKey: 'BREEDING_BIRTH',
        },
        data: { status: 'TODO', completedAt: null },
      });
    });
    return true;
  }
}
