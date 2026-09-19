import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';

import {
  BreedingStatus,
  PregnancyResult,
} from '../generated/prisma/client';

import { CreatePregnancyCheckInput } from './inputs/create-pregnancy-check.input';

@Injectable()
export class PregnancyService {
  constructor(private readonly prisma: PrismaService) {}

  private toPregnancyModel<T extends { checkDate: Date }>(
    pregnancy: T,
  ) {
    const { checkDate, ...pregnancyData } = pregnancy;

    return {
      ...pregnancyData,
      checkedDate: checkDate,
    };
  }

  async createCheck(
    input: CreatePregnancyCheckInput,
    currentUser: CurrentUserType,
  ) {
    const breeding = await this.prisma.breeding.findFirst({
      where: {
        id: input.breedingId,
        farmId: currentUser.farmId,
      },
    });

    if (!breeding) {
      throw new NotFoundException(
        'Accouplement introuvable.',
      );
    }

    if (breeding.status === BreedingStatus.CANCELLED) {
      throw new BadRequestException(
        'Impossible d\'enregistrer une palpation pour un accouplement annulé.',
      );
    }

    if (breeding.status === BreedingStatus.BIRTH_RECORDED) {
      throw new BadRequestException(
        'La naissance a déjà été enregistrée pour cet accouplement.',
      );
    }

    const checkedDate = new Date(input.checkedDate);

    if (checkedDate < breeding.breedingDate) {
      throw new BadRequestException(
        'La date de palpation ne peut pas être antérieure à la date de saillie.',
      );
    }

    const pregnancy = await this.prisma.$transaction(
      async (tx) => {
        const created = await tx.pregnancy.create({
          data: {
            farmId: currentUser.farmId,
            breedingId: input.breedingId,
            checkDate: checkedDate,
            result: input.result,
            observation: input.observation?.trim() || null,
          },
        });

        let newStatus: BreedingStatus;

        switch (input.result) {
          case PregnancyResult.PREGNANT:
            newStatus = BreedingStatus.PREGNANT;
            break;

          case PregnancyResult.NOT_PREGNANT:
            newStatus = BreedingStatus.NON_PREGNANT;
            break;

          case PregnancyResult.INCONCLUSIVE:
            newStatus = BreedingStatus.INCONCLUSIVE;
            break;

          default:
            throw new BadRequestException(
              'Résultat de palpation invalide.',
            );
        }

        await tx.breeding.update({
          where: {
            id: breeding.id,
          },
          data: {
            status: newStatus,
          },
        });

        return created;
      },
    );

    return this.toPregnancyModel(pregnancy);
  }

  async findAll(
    currentUser: CurrentUserType,
  ) {
    const pregnancies = await this.prisma.pregnancy.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      orderBy: {
        checkDate: 'desc',
      },
    });

    return pregnancies.map((pregnancy) =>
      this.toPregnancyModel(pregnancy),
    );
  }

  async findByBreeding(
    breedingId: string,
    currentUser: CurrentUserType,
  ) {
    const breeding = await this.prisma.breeding.findFirst({
      where: {
        id: breedingId,
        farmId: currentUser.farmId,
      },
    });

    if (!breeding) {
      throw new NotFoundException(
        'Accouplement introuvable.',
      );
    }

    const pregnancies = await this.prisma.pregnancy.findMany({
      where: {
        breedingId,
        farmId: currentUser.farmId,
      },
      orderBy: {
        checkDate: 'desc',
      },
    });

    return pregnancies.map((pregnancy) =>
      this.toPregnancyModel(pregnancy),
    );
  }
}