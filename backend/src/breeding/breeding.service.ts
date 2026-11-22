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
import { UpdateBreedingInput } from './inputs/update-breeding.input.js';

import {
  BreedingStatus,
  RabbitSex,
  RabbitStatus,
  TaskSourceType,
} from '../generated/prisma/client.js';

import { computeBreedingCalendar } from '../common/calendar/breeding-calendar.js';
import { GenealogyService } from '../genetics/genealogy.service.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';
import { daysBetween, profileWarnings } from './reproduction-profile.js';
import { MAX_FEMALES_PER_MALE_24H, femalesCoveredAround, maleLimitMessage, sameMatingDay } from './mating-rules.js';

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
  matings: { include: { male: true }, orderBy: { date: 'asc' as const } },
} as const;

type BreedingWithRelations = {
  birth?: { id: string } | null;
  matings?: unknown[];
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
      matings: breeding.matings ?? [],
      matingCount: (breeding.matings?.length ?? 0) + 1,
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

    // Limite du mâle : 2 femelles différentes au plus sur 24 h.
    const covered = (await femalesCoveredAround(this.prisma, currentUser.farmId, male.id, breedingDate))
      .filter((f) => f.id !== female.id);
    if (covered.length >= MAX_FEMALES_PER_MALE_24H) {
      throw new BadRequestException(maleLimitMessage(male.code, covered.map((f) => f.code)));
    }

    if (activeBreeding) {
      // Nouvelle saillie le même jour : elle s'ajoute à l'accouplement existant.
      if (sameMatingDay(activeBreeding.breedingDate, breedingDate)) {
        await this.prisma.breedingMating.create({
          data: { breedingId: activeBreeding.id, maleId: male.id, date: breedingDate },
        });
        const note = input.observation?.trim();
        const updated = await this.prisma.breeding.update({
          where: { id: activeBreeding.id },
          data: note ? { observation: [activeBreeding.observation, note].filter(Boolean).join('\n') } : {},
          include: breedingInclude,
        });
        return this.toModel(updated);
      }
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

      // Poids relevés au moment de la saillie.
      for (const [rabbitId, weight] of [
        [female.id, input.femaleWeight],
        [male.id, input.maleWeight],
      ] as const) {
        if (weight != null) {
          if (!(weight > 0) || weight > 15) {
            throw new BadRequestException('Le poids doit être compris entre 0 et 15 kg.');
          }
          await tx.rabbit.update({ where: { id: rabbitId }, data: { weight } });
        }
      }

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
   * Ce que le formulaire doit savoir avant d'enregistrer une saillie :
   * charge du mâle sur 24 h et accouplement du jour déjà ouvert pour la femelle.
   */
  async matingContext(femaleId: string | undefined, maleId: string | undefined, date: Date, currentUser: CurrentUserType) {
    const farmId = currentUser.farmId;
    const covered = maleId
      ? (await femalesCoveredAround(this.prisma, farmId, maleId, date)).filter((f) => f.id !== femaleId)
      : [];
    const sameDay = femaleId
      ? await this.prisma.breeding.findFirst({
          where: { farmId, femaleId, status: { in: ACTIVE_BREEDING_STATUSES } },
          include: { matings: { select: { id: true } } },
        })
      : null;
    return {
      maleFemalesLast24h: covered.map((f) => f.code),
      maleLimitReached: covered.length >= MAX_FEMALES_PER_MALE_24H,
      sameDayBreedingId: sameDay && sameMatingDay(sameDay.breedingDate, date) ? sameDay.id : null,
      sameDayMatingCount: sameDay && sameMatingDay(sameDay.breedingDate, date) ? sameDay.matings.length + 1 : 0,
      femaleHasOtherActiveBreeding: Boolean(sameDay && !sameMatingDay(sameDay.breedingDate, date)),
    };
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

  /**
   * Corrige un accouplement tant que la mise bas n'est pas enregistrée.
   * Le calendrier et les tâches ouvertes sont recalculés.
   */
  async update(input: UpdateBreedingInput, currentUser: CurrentUserType) {
    const breeding = await this.prisma.breeding.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
      include: { female: true, male: true, birth: { select: { id: true } } },
    });
    if (!breeding) {
      throw new NotFoundException('Accouplement introuvable.');
    }
    const structural = input.maleId !== undefined || input.breedingDate !== undefined;
    if (structural && breeding.birth) {
      throw new ConflictException(
        'La mise bas est déjà enregistrée : supprime-la d’abord pour corriger l’accouplement.',
      );
    }

    let male = breeding.male;
    if (input.maleId && input.maleId !== breeding.maleId) {
      const candidate = await this.prisma.rabbit.findFirst({
        where: { id: input.maleId, farmId: currentUser.farmId },
      });
      if (!candidate) {
        throw new NotFoundException('Mâle introuvable dans cette ferme.');
      }
      if (candidate.sex !== RabbitSex.MALE) {
        throw new BadRequestException(
          `Le lapin ${candidate.code} ne peut pas être utilisé comme mâle.`,
        );
      }
      await this.genealogy.assertBreedingAllowed(
        breeding.femaleId,
        candidate.id,
        currentUser,
        input.acknowledgeWarnings ?? false,
      );
      male = candidate;
    }

    const breedingDate = input.breedingDate ? new Date(input.breedingDate) : breeding.breedingDate;
    if (Number.isNaN(breedingDate.getTime())) {
      throw new BadRequestException('La date d’accouplement est invalide.');
    }
    const dateChanged = breedingDate.getTime() !== breeding.breedingDate.getTime();
    const calendar = dateChanged ? computeBreedingCalendar(breedingDate) : null;

    if (dateChanged || male.id !== breeding.maleId) {
      const covered = (await femalesCoveredAround(this.prisma, currentUser.farmId, male.id, breedingDate))
        .filter((f) => f.id !== breeding.femaleId);
      if (covered.length >= MAX_FEMALES_PER_MALE_24H) {
        throw new BadRequestException(maleLimitMessage(male.code, covered.map((f) => f.code)));
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.breeding.update({
        where: { id: breeding.id },
        data: {
          maleId: male.id,
          breedingDate,
          ...(calendar ?? {}),
          observation:
            input.observation === undefined ? undefined : input.observation.trim() || null,
        },
        include: breedingInclude,
      });
      if (
        (dateChanged || male.id !== breeding.maleId) &&
        ACTIVE_BREEDING_STATUSES.includes(breeding.status as (typeof ACTIVE_BREEDING_STATUSES)[number])
      ) {
        await this.tasks.onBreedingUpdated(
          currentUser.farmId,
          {
            id: result.id,
            femaleId: breeding.femaleId,
            femaleCode: breeding.female.code,
            maleCode: male.code,
            palpationStartDate: result.palpationStartDate!,
            palpationEndDate: result.palpationEndDate!,
            nestDate: result.nestDate!,
            expectedBirthStartDate: result.expectedBirthStartDate!,
            expectedBirthEndDate: result.expectedBirthEndDate!,
          },
          tx,
        );
      }
      return result;
    });
    return this.toModel(updated);
  }

  /**
   * Supprime un accouplement saisi par erreur (avec ses palpations,
   * son nid et ses tâches automatiques ouvertes). Impossible après
   * l'enregistrement de la mise bas.
   */
  async remove(id: string, currentUser: CurrentUserType) {
    const breeding = await this.prisma.breeding.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: { birth: { select: { id: true } }, litters: { select: { id: true } } },
    });
    if (!breeding) {
      throw new NotFoundException('Accouplement introuvable.');
    }
    if (breeding.birth || breeding.litters.length) {
      throw new ConflictException(
        'Une mise bas est liée à cet accouplement : supprime-la d’abord.',
      );
    }
    await this.prisma.$transaction(async (tx) => {
      // Accouplement saisi par erreur : ses tâches automatiques disparaissent.
      await tx.task.deleteMany({
        where: {
          farmId: currentUser.farmId,
          sourceType: { in: [TaskSourceType.BREEDING, TaskSourceType.PREGNANCY] },
          sourceId: breeding.id,
          automationKey: { not: null },
        },
      });
      await tx.breeding.delete({ where: { id: breeding.id } });
    });
    return true;
  }

  /** Résumé d'un reproducteur, affiché avant d'enregistrer une saillie. */
  async reproductionProfile(rabbitId: string, currentUser: CurrentUserType) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: rabbitId, farmId: currentUser.farmId },
      include: {
        motherBirths: { orderBy: { birthDate: 'desc' }, select: { birthDate: true, liveBorn: true } },
        motherLitters: { where: { status: 'ACTIVE' }, select: { currentCount: true } },
        breedingsAsFemale: { select: { breedingDate: true, status: true, birth: { select: { id: true } } } },
        breedingsAsMale: { select: { breedingDate: true, status: true, birth: { select: { id: true } } } },
        healthRecords: { orderBy: { date: 'desc' }, take: 5 },
      },
    });
    if (!rabbit) throw new NotFoundException('Lapin introuvable.');

    const now = new Date();
    const female = rabbit.sex === RabbitSex.FEMALE;
    const breedings = female ? rabbit.breedingsAsFemale : rabbit.breedingsAsMale;
    const appLitters = rabbit.motherBirths.length;
    const totalLitters = (rabbit.previousLitters ?? 0) + appLitters;
    const kitsBornAlive =
      (rabbit.previousKitsBorn ?? 0) + rabbit.motherBirths.reduce((sum, b) => sum + b.liveBorn, 0);
    const lastBirthDate = [rabbit.motherBirths[0]?.birthDate, rabbit.lastBirthDate]
      .filter((d): d is Date => !!d)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
    const lastMating = breedings
      .map((b) => b.breedingDate)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
    const isActive = (status: BreedingStatus) => (ACTIVE_BREEDING_STATUSES as BreedingStatus[]).includes(status);
    const closed = breedings.filter((b) => !isActive(b.status) && b.status !== BreedingStatus.CANCELLED);
    const successRate = closed.length
      ? Math.round((closed.filter((b) => b.birth).length / closed.length) * 100)
      : null;
    const active = breedings.find((b) => isActive(b.status));
    const recent = rabbit.healthRecords.filter((h) => daysBetween(h.date, now) <= 30 && h.type !== 'VACCINATION');
    const weight = rabbit.weight != null ? Number(rabbit.weight) : null;
    const ageDays = rabbit.birthDate ? daysBetween(rabbit.birthDate, now) : null;
    const daysSinceLastBirth = lastBirthDate ? daysBetween(lastBirthDate, now) : null;
    const nursingKits = rabbit.motherLitters.reduce((sum, l) => sum + l.currentCount, 0);
    const matingsLast7Days = breedings.filter((b) => daysBetween(b.breedingDate, now) < 7).length;

    return {
      id: rabbit.id,
      code: rabbit.code,
      sex: rabbit.sex,
      ageDays,
      weight,
      totalLitters,
      kitsBornAlive,
      averageLiveBorn: totalLitters ? Math.round((kitsBornAlive / totalLitters) * 10) / 10 : null,
      lastBirthDate,
      daysSinceLastBirth,
      nursingKits,
      maternalBehavior: rabbit.maternalBehavior,
      healthHistory: rabbit.healthHistory,
      totalMatings: (rabbit.previousMatings ?? 0) + breedings.length,
      previousKitsLost: rabbit.previousKitsLost,
      cannibalismCases: rabbit.cannibalismCases,
      previousFemales: rabbit.previousFemales,
      matingsLast7Days,
      lastMatingDate: lastMating,
      successRate,
      activeBreedingStatus: active?.status ?? null,
      recentHealth: rabbit.healthRecords.slice(0, 3).map((h) => ({
        date: h.date,
        text: [h.diagnosis, h.symptoms, h.treatment, h.observation].filter(Boolean).join(' · ') || 'Note de santé',
      })),
      warnings: profileWarnings({
        sex: rabbit.sex,
        ageDays,
        weight,
        daysSinceLastBirth,
        nursingKits,
        matingsLast7Days,
        maternalBehavior: rabbit.maternalBehavior,
        recentHealthCount: recent.length,
        activeBreedingStatus: active?.status ?? null,
        cannibalismCases: rabbit.cannibalismCases,
      }),
    };
  }
}
