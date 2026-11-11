import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CurrentUserType } from '../auth/types/current-user.type.js';

import { CreateBreedingInput } from './inputs/create-breeding.input.js';
import { RecordNestInstallationInput } from './inputs/record-nest-installation.input.js';
import { CancelBreedingInput } from './inputs/cancel-breeding.input.js';

import {
  BreedingStatus,
  RabbitSex,
  RabbitStatus,
} from '../generated/prisma/client.js';

import { computeBreedingCalendar } from '../common/calendar/breeding-calendar.js';
import { GenealogyService } from '../genetics/genealogy.service.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';

/** Statuts pour lesquels la femelle est engagée dans un cycle. */
export const ACTIVE_BREEDING_STATUSES = [
  BreedingStatus.PLANNED,
  BreedingStatus.AWAITING_PALPATION,
  BreedingStatus.PREGNANT,
  BreedingStatus.INCONCLUSIVE,
];

const breedingInclude = {
  female: true,
  male: true,
  nestInstallation: true,
  birth: { select: { id: true } },
} as const;

type BreedingWithRelations = {
  birth?: { id: string } | null;
  [key: string]: unknown;
};

@Injectable()
export class BreedingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genealogy: GenealogyService,
    private readonly tasks: TaskAutomationService,
  ) {}

  private toModel<T extends BreedingWithRelations>(breeding: T) {
    return {
      ...breeding,
      birthId: breeding.birth?.id ?? null,
    };
  }

  async findAll(
    currentUser: CurrentUserType,
    status?: BreedingStatus,
  ) {
    const breedings = await this.prisma.breeding.findMany({
      where: {
        farmId: currentUser.farmId,
        ...(status ? { status } : {}),
      },
      include: breedingInclude,
      orderBy: {
        breedingDate: 'desc',
      },
    });

    return breedings.map((breeding) => this.toModel(breeding));
  }

  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const breeding = await this.prisma.breeding.findFirst({
      where: {
        id,
        farmId: currentUser.farmId,
      },
      include: breedingInclude,
    });

    if (!breeding) {
      throw new NotFoundException('Accouplement introuvable.');
    }

    return this.toModel(breeding);
  }

  /**
   * Enregistre un accouplement après les contrôles du §21 :
   * existence, statut actif, sexes, même ferme, compatibilité
   * généalogique, puis calcul du calendrier et des tâches.
   */
  async create(
    input: CreateBreedingInput,
    currentUser: CurrentUserType,
  ) {
    if (input.femaleId === input.maleId) {
      throw new BadRequestException(
        'La femelle et le mâle doivent être deux lapins différents.',
      );
    }

    const [female, male] = await Promise.all([
      this.prisma.rabbit.findFirst({
        where: { id: input.femaleId, farmId: currentUser.farmId },
      }),
      this.prisma.rabbit.findFirst({
        where: { id: input.maleId, farmId: currentUser.farmId },
      }),
    ]);

    if (!female) {
      throw new NotFoundException('Femelle introuvable dans cette ferme.');
    }

    if (!male) {
      throw new NotFoundException('Mâle introuvable dans cette ferme.');
    }

    if (female.sex !== RabbitSex.FEMALE) {
      throw new BadRequestException(
        `Le lapin ${female.code} ne peut pas être utilisé comme femelle.`,
      );
    }

    if (male.sex !== RabbitSex.MALE) {
      throw new BadRequestException(
        `Le lapin ${male.code} ne peut pas être utilisé comme mâle.`,
      );
    }

    if (female.status !== RabbitStatus.ACTIVE) {
      throw new BadRequestException(
        `La femelle ${female.code} n'est pas active.`,
      );
    }

    if (male.status !== RabbitStatus.ACTIVE) {
      throw new BadRequestException(`Le mâle ${male.code} n'est pas actif.`);
    }

    const breedingDate = new Date(input.breedingDate);

    if (Number.isNaN(breedingDate.getTime())) {
      throw new BadRequestException('La date d’accouplement est invalide.');
    }

    const activeBreeding = await this.prisma.breeding.findFirst({
      where: {
        farmId: currentUser.farmId,
        femaleId: female.id,
        status: { in: ACTIVE_BREEDING_STATUSES },
      },
    });

    if (activeBreeding) {
      throw new BadRequestException(
        `La femelle ${female.code} possède déjà un accouplement actif.`,
      );
    }

    // Contrôle généalogique multi-générations (§18, §63)
    await this.genealogy.assertBreedingAllowed(
      female.id,
      male.id,
      currentUser,
      input.acknowledgeWarnings ?? false,
    );

    const calendar = computeBreedingCalendar(breedingDate);

    const breeding = await this.prisma.$transaction(async (tx) => {
      const created = await tx.breeding.create({
        data: {
          farmId: currentUser.farmId,
          femaleId: female.id,
          maleId: male.id,
          breedingDate,
          ...calendar,
          status: BreedingStatus.AWAITING_PALPATION,
          observation: input.observation?.trim() || null,
        },
        include: breedingInclude,
      });

      await this.tasks.onBreedingCreated(
        currentUser.farmId,
        {
          id: created.id,
          femaleId: female.id,
          femaleCode: female.code,
          maleCode: male.code,
          ...calendar,
        },
        tx,
      );

      return created;
    });

    return this.toModel(breeding);
  }

  /**
   * Annule un accouplement non terminé et ses tâches.
   */
  async cancel(input: CancelBreedingInput, currentUser: CurrentUserType) {
    const breeding = await this.findOne(input.id, currentUser);

    if (
      breeding.status === BreedingStatus.BIRTH_RECORDED ||
      breeding.status === BreedingStatus.CANCELLED
    ) {
      throw new ConflictException(
        'Cet accouplement est déjà terminé ou annulé.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.breeding.update({
        where: { id: breeding.id },
        data: {
          status: BreedingStatus.CANCELLED,
          observation: input.observation?.trim() || breeding.observation,
        },
        include: breedingInclude,
      });

      await this.tasks.onBreedingCancelled(currentUser.farmId, breeding.id, tx);

      return result;
    });

    return this.toModel(updated);
  }

  /**
   * Installation du nid (§25).
   */
  async recordNestInstallation(
    input: RecordNestInstallationInput,
    currentUser: CurrentUserType,
  ) {
    const breeding = await this.findOne(input.breedingId, currentUser);

    if (breeding.status === BreedingStatus.CANCELLED) {
      throw new BadRequestException(
        'Impossible d’installer un nid pour un accouplement annulé.',
      );
    }

    if (breeding.status === BreedingStatus.NON_PREGNANT) {
      throw new BadRequestException(
        'La femelle a été déclarée vide : aucun nid à installer.',
      );
    }

    const installedAt = new Date(input.installedAt);

    if (Number.isNaN(installedAt.getTime())) {
      throw new BadRequestException('La date d’installation est invalide.');
    }

    if (installedAt < breeding.breedingDate) {
      throw new BadRequestException(
        'Le nid ne peut pas être installé avant l’accouplement.',
      );
    }

    const data = {
      installedAt,
      nestType: input.nestType?.trim() || null,
      material: input.material?.trim() || null,
      observation: input.observation?.trim() || null,
    };

    return this.prisma.$transaction(async (tx) => {
      const nest = await tx.nestInstallation.upsert({
        where: { breedingId: breeding.id },
        create: {
          farmId: currentUser.farmId,
          breedingId: breeding.id,
          ...data,
        },
        update: data,
      });

      await this.tasks.onNestInstalled(currentUser.farmId, breeding.id, tx);

      return nest;
    });
  }
}
