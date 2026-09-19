import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';

import {
  BreedingStatus,
} from '../generated/prisma/client';

import { CreateBirthInput } from './inputs/create-birth.input';

@Injectable()
export class BirthsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    input: CreateBirthInput,
    currentUser: CurrentUserType,
  ) {
    if (input.liveBorn < 0) {
      throw new BadRequestException(
        'Le nombre de lapereaux vivants ne peut pas être négatif.',
      );
    }

    if (input.stillBorn < 0) {
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
          orderBy: {
            checkDate: 'desc',
          },
          take: 1,
        },
        birth: true,
      },
    });

    if (!breeding) {
      throw new NotFoundException(
        'Accouplement introuvable.',
      );
    }

    if (breeding.birth) {
      throw new BadRequestException(
        'Une naissance est déjà enregistrée pour cet accouplement.',
      );
    }

    if (breeding.status === BreedingStatus.CANCELLED) {
      throw new BadRequestException(
        'Impossible d\'enregistrer une naissance pour un accouplement annulé.',
      );
    }

    if (
      breeding.pregnancies.length === 0 ||
      breeding.pregnancies[0].result !== 'PREGNANT'
    ) {
      throw new BadRequestException(
        'La gestation doit être confirmée avant d\'enregistrer la naissance.',
      );
    }

    const birthDate = new Date(input.birthDate);

    if (birthDate < breeding.breedingDate) {
      throw new BadRequestException(
        'La date de naissance ne peut pas être antérieure à la saillie.',
      );
    }

    const birth = await this.prisma.$transaction(
      async (tx) => {
        const createdBirth = await tx.birth.create({
          data: {
            farmId: currentUser.farmId,
            breedingId: input.breedingId,
            motherId: breeding.femaleId,
            birthDate,
            liveBorn: input.liveBorn,
            stillBorn: input.stillBorn,
            observation:
              input.observation?.trim() || null,
          },
        });

        await tx.breeding.update({
          where: {
            id: breeding.id,
          },
          data: {
            status: BreedingStatus.BIRTH_RECORDED,
          },
        });

        return createdBirth;
      },
    );

    return birth;
  }

  async findAll(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.birth.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      orderBy: {
        birthDate: 'desc',
      },
    });
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
    });

    if (!birth) {
      throw new NotFoundException(
        'Naissance introuvable.',
      );
    }

    return birth;
  }
}