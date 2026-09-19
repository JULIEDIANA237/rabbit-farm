import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';

import { CreateBreedingInput } from './inputs/create-breeding.input';

import {
  BreedingStatus,
  RabbitStatus,
} from '../generated/prisma/client';

@Injectable()
export class BreedingService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.breeding.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      include: {
        female: true,
        male: true,
      },
      orderBy: {
        breedingDate: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const breeding =
      await this.prisma.breeding.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },
        include: {
          female: true,
          male: true,
          pregnancies: true,
          birth: true,
        },
      });

    if (!breeding) {
      throw new NotFoundException(
        'Accouplement introuvable.',
      );
    }

    return breeding;
  }

  async create(
    input: CreateBreedingInput,
    currentUser: CurrentUserType,
  ) {
    // ---------------------------------------------
    // 1. Vérifications de base
    // ---------------------------------------------

    if (input.femaleId === input.maleId) {
      throw new BadRequestException(
        'La femelle et le mâle doivent être deux lapins différents.',
      );
    }

    const female = await this.prisma.rabbit.findFirst({
      where: {
        id: input.femaleId,
        farmId: currentUser.farmId,
      },
    });

    const male = await this.prisma.rabbit.findFirst({
      where: {
        id: input.maleId,
        farmId: currentUser.farmId,
      },
    });

    if (!female) {
      throw new NotFoundException(
        'Femelle introuvable dans cette ferme.',
      );
    }

    if (!male) {
      throw new NotFoundException(
        'Mâle introuvable dans cette ferme.',
      );
    }

    // ---------------------------------------------
    // 2. Vérification des sexes
    // ---------------------------------------------

    if (female.sex !== 'FEMALE') {
      throw new BadRequestException(
        `Le lapin ${female.code} ne peut pas être utilisé comme femelle.`,
      );
    }

    if (male.sex !== 'MALE') {
      throw new BadRequestException(
        `Le lapin ${male.code} ne peut pas être utilisé comme mâle.`,
      );
    }

    // ---------------------------------------------
    // 3. Vérification des statuts
    // ---------------------------------------------

    if (female.status !== RabbitStatus.ACTIVE) {
      throw new BadRequestException(
        `La femelle ${female.code} n'est pas active.`,
      );
    }

    if (male.status !== RabbitStatus.ACTIVE) {
      throw new BadRequestException(
        `Le mâle ${male.code} n'est pas actif.`,
      );
    }

    // ---------------------------------------------
    // 4. Vérification de la date
    // ---------------------------------------------

    const breedingDate = new Date(input.breedingDate);

    if (Number.isNaN(breedingDate.getTime())) {
      throw new BadRequestException(
        'La date d’accouplement est invalide.',
      );
    }

    // ---------------------------------------------
    // 5. Vérifier qu'une gestation/saillie active
    //    n'existe pas déjà pour cette femelle
    // ---------------------------------------------

    const activeBreeding =
      await this.prisma.breeding.findFirst({
        where: {
          farmId: currentUser.farmId,
          femaleId: female.id,
          status: {
            in: [
              BreedingStatus.PLANNED,
              BreedingStatus.AWAITING_PALPATION,
              BreedingStatus.PREGNANT,
              BreedingStatus.INCONCLUSIVE,
            ],
          },
        },
      });

    if (activeBreeding) {
      throw new BadRequestException(
        `La femelle ${female.code} possède déjà un accouplement actif.`,
      );
    }

    // ---------------------------------------------
    // 6. Contrôle généalogique
    // ---------------------------------------------

    await this.validateGeneticCompatibility(
      female.id,
      male.id,
      currentUser,
    );

    // ---------------------------------------------
    // 7. Calcul du calendrier
    // ---------------------------------------------

    const palpationStartDate =
      this.addDays(breedingDate, 10);

    const palpationEndDate =
      this.addDays(breedingDate, 14);

    const nestDate =
      this.addDays(breedingDate, 28);

    const expectedBirthStartDate =
      this.addDays(breedingDate, 30);

    const expectedBirthEndDate =
      this.addDays(breedingDate, 32);

    // ---------------------------------------------
    // 8. Création
    // ---------------------------------------------

    return this.prisma.breeding.create({
      data: {
        farmId: currentUser.farmId,

        femaleId: female.id,
        maleId: male.id,

        breedingDate,

        palpationStartDate,
        palpationEndDate,

        nestDate,

        expectedBirthStartDate,
        expectedBirthEndDate,

        status: BreedingStatus.AWAITING_PALPATION,

        observation:
          input.observation?.trim() || null,
      },
    });
  }

  private addDays(
    date: Date,
    days: number,
  ): Date {
    const result = new Date(date);

    result.setDate(
      result.getDate() + days,
    );

    return result;
  }

  private async validateGeneticCompatibility(
    femaleId: string,
    maleId: string,
    currentUser: CurrentUserType,
  ) {
    // Parent/enfant direct
    const female = await this.prisma.rabbit.findFirst({
      where: {
        id: femaleId,
        farmId: currentUser.farmId,
      },
      select: {
        fatherId: true,
        motherId: true,
      },
    });

    const male = await this.prisma.rabbit.findFirst({
      where: {
        id: maleId,
        farmId: currentUser.farmId,
      },
      select: {
        fatherId: true,
        motherId: true,
      },
    });

    if (!female || !male) {
      throw new NotFoundException(
        'Impossible de vérifier la généalogie.',
      );
    }

    if (
      female.fatherId === maleId ||
      female.motherId === maleId
    ) {
      throw new BadRequestException(
        'Accouplement interdit : le mâle est le parent direct de la femelle.',
      );
    }

    if (
      male.fatherId === femaleId ||
      male.motherId === femaleId
    ) {
      throw new BadRequestException(
        'Accouplement interdit : la femelle est le parent direct du mâle.',
      );
    }

    // Parents communs
    const commonParents = [];

    if (
      female.fatherId &&
      female.fatherId === male.fatherId
    ) {
      commonParents.push(female.fatherId);
    }

    if (
      female.fatherId &&
      female.fatherId === male.motherId
    ) {
      commonParents.push(female.fatherId);
    }

    if (
      female.motherId &&
      female.motherId === male.fatherId
    ) {
      commonParents.push(female.motherId);
    }

    if (
      female.motherId &&
      female.motherId === male.motherId
    ) {
      commonParents.push(female.motherId);
    }

    if (commonParents.length > 0) {
      throw new BadRequestException(
        'Accouplement interdit : la femelle et le mâle ont un parent commun connu.',
      );
    }

    // Pour l'instant, cette méthode détecte les relations
    // directes et les parents communs.
    //
    // La détection des grands-parents / arrière-grands-parents
    // sera renforcée dans le module Genetics.
  }
}