import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { BirthsService } from '../births/births.service.js';
import { BreedingService } from '../breeding/breeding.service.js';
import { sameMatingDay } from '../breeding/mating-rules.js';
import { BREEDING_CALENDAR, addDays, diffInDays } from '../common/calendar/breeding-calendar.js';
import { FatteningService } from '../fattening/fattening.service.js';
import { BreedingStatus, FatteningLotStatus, PregnancyResult, TaskSourceType } from '../generated/prisma/client.js';
import { MortalityService } from '../mortality/mortality.service.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';
import { PregnancyService } from '../pregnancy/pregnancy.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { WeaningService } from '../weaning/weaning.service.js';
import { RecordPastBreedingInput } from './record-past-breeding.input.js';

/** À partir de cet âge, la portée d'une saillie est déjà sevrée (mise bas J+30, sevrage 35 jours après). */
export const PAST_BREEDING_MIN_DAYS = BREEDING_CALENDAR.birthStart + BREEDING_CALENDAR.weaning;
/** Mise bas retenue quand l'éleveur ne donne pas la date. */
const DEFAULT_GESTATION_DAYS = 31;
const MIN_GESTATION_DAYS = 25;

/**
 * Saillie ancienne saisie après coup : saillie, palpation positive,
 * mise bas, morts avant sevrage, sevrage, lot d'engraissement et cage,
 * enregistrés d'un coup avec les dates du passé.
 */
@Injectable()
export class PastBreedingService {
  private readonly logger = new Logger(PastBreedingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly breedings: BreedingService,
    private readonly pregnancies: PregnancyService,
    private readonly births: BirthsService,
    private readonly weanings: WeaningService,
    private readonly mortality: MortalityService,
    private readonly fattening: FatteningService,
    private readonly tasks: TaskAutomationService,
  ) {}

  async record(input: RecordPastBreedingInput, currentUser: CurrentUserType) {
    const farmId = currentUser.farmId;
    const now = new Date();
    const breedingDate = new Date(input.breedingDate);
    if (Number.isNaN(breedingDate.getTime())) throw new BadRequestException('La date de saillie est invalide.');
    if (diffInDays(breedingDate, now) < PAST_BREEDING_MIN_DAYS) {
      throw new BadRequestException(
        `La suite automatique concerne les saillies d'il y a ${PAST_BREEDING_MIN_DAYS} jours ou plus. Pour une saillie plus récente, enregistre-la normalement.`,
      );
    }

    const stillBorn = input.stillBorn ?? 0;
    const { liveBorn, weanedCount } = input;
    if (![liveBorn, stillBorn, weanedCount].every((n) => Number.isInteger(n) && n >= 0)) {
      throw new BadRequestException('Les nombres de lapereaux doivent être des entiers positifs.');
    }
    if (liveBorn + stillBorn === 0) throw new BadRequestException('La mise bas doit comporter au moins un lapereau.');
    if (weanedCount > liveBorn) throw new BadRequestException('Il ne peut pas y avoir plus de sevrés que de nés vivants.');

    const birthDate = input.birthDate ? new Date(input.birthDate) : addDays(breedingDate, DEFAULT_GESTATION_DAYS);
    if (Number.isNaN(birthDate.getTime())) throw new BadRequestException('La date de mise bas est invalide.');
    const gestation = diffInDays(breedingDate, birthDate);
    if (gestation < MIN_GESTATION_DAYS || gestation > 40) {
      throw new BadRequestException('La mise bas doit avoir lieu entre 25 et 40 jours après la saillie.');
    }
    const weaningDate = input.weaningDate
      ? new Date(input.weaningDate)
      : new Date(Math.min(addDays(birthDate, BREEDING_CALENDAR.weaning).getTime(), now.getTime()));
    if (Number.isNaN(weaningDate.getTime())) throw new BadRequestException('La date de sevrage est invalide.');
    if (weaningDate < birthDate) throw new BadRequestException('Le sevrage ne peut pas précéder la mise bas.');
    if (weaningDate > now) throw new BadRequestException('Le sevrage ne peut pas être dans le futur.');

    // Une femelle ne porte qu'une portée à la fois : aucune autre saillie pendant cette gestation.
    const overlap = await this.prisma.breeding.findFirst({
      where: {
        farmId,
        femaleId: input.femaleId,
        status: { notIn: [BreedingStatus.CANCELLED, BreedingStatus.NON_PREGNANT] },
        breedingDate: { gt: addDays(breedingDate, -MIN_GESTATION_DAYS), lt: birthDate },
      },
      select: { breedingDate: true },
    });
    if (overlap && !sameMatingDay(overlap.breedingDate, breedingDate)) {
      throw new BadRequestException(
        `Cette femelle a déjà une saillie le ${overlap.breedingDate.toLocaleDateString('fr-FR', { timeZone: 'Africa/Douala' })}, pendant cette gestation. Vérifie les dates.`,
      );
    }
    if (overlap) {
      throw new BadRequestException('Cette saillie est déjà enregistrée pour ce jour-là.');
    }

    if (weanedCount > 0) await this.checkLotAndCage(farmId, input.fatteningLotId, input.cageId, weanedCount);

    const breeding = await this.breedings.create(
      {
        femaleId: input.femaleId,
        maleId: input.maleId,
        breedingDate,
        observation: [input.observation?.trim(), 'Saillie saisie après coup.'].filter(Boolean).join('\n'),
        acknowledgeWarnings: input.acknowledgeWarnings,
      },
      currentUser,
      { earlierThanActive: true },
    );

    let birthId: string | null = null;
    let weaned = false;
    try {
      await this.pregnancies.createCheck(
        {
          breedingId: breeding.id,
          checkedDate: addDays(breedingDate, BREEDING_CALENDAR.palpationStart + 2),
          result: PregnancyResult.PREGNANT,
          observation: 'Saisie après coup',
        },
        currentUser,
      );
      const birth = await this.births.create(
        { breedingId: breeding.id, birthDate, liveBorn, stillBorn, createKits: true },
        currentUser,
      );
      birthId = birth.id;

      // Morts avant le sevrage d'abord : la portée finit alors « sevrée ».
      const dead = liveBorn - weanedCount;
      if (dead > 0 && birth.litterId) {
        await this.mortality.recordLitterMortality(
          { litterId: birth.litterId, date: weaningDate, count: dead, cause: 'Mort avant le sevrage' },
          currentUser,
        );
      }

      if (weanedCount > 0 && birth.litterId) {
        const weaning = await this.weanings.create(
          {
            litterId: birth.litterId,
            plannedDate: weaningDate,
            actualDate: weaningDate,
            quantity: weanedCount,
            averageWeight: input.averageWeight,
            fatteningLotId: input.fatteningLotId,
            createFatteningLot: !input.fatteningLotId,
          },
          currentUser,
        );
        weaned = true;
        if (input.cageId && weaning.fatteningLotId) {
          await this.fattening.moveLot(
            { lotId: weaning.fatteningLotId, cageId: input.cageId, date: weaningDate, moveMembers: true },
            currentUser,
          );
        }
      }
      // Rappels du passé (nid, déparasitage, sevrage…) : plus rien à faire.
      await this.tasks.removeOpenTasksForSource(farmId, TaskSourceType.BREEDING, breeding.id);
      await this.tasks.removeOpenTasksForSource(farmId, TaskSourceType.PREGNANCY, breeding.id);
      await this.tasks.removeOpenTasksForSource(farmId, TaskSourceType.BIRTH, birth.id);
    } catch (error) {
      // Après le sevrage, tout est déjà en place : seul le geste manquant reste à refaire.
      if (weaned) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new BadRequestException(
          `Saillie, mise bas et sevrage enregistrés, mais la dernière étape a échoué : ${reason} Termine-la depuis le lot ou la portée.`,
        );
      }
      await this.undo(breeding.id, birthId, currentUser).catch((cleanup: unknown) =>
        this.logger.error(`Saillie ancienne ${breeding.id} : annulation incomplète`, cleanup as Error),
      );
      throw error;
    }

    return this.breedings.findOne(breeding.id, currentUser);
  }

  private async checkLotAndCage(farmId: string, lotId: string | undefined, cageId: string | undefined, count: number) {
    if (lotId) {
      const lot = await this.prisma.fatteningLot.findFirst({ where: { id: lotId, farmId }, select: { status: true } });
      if (!lot || lot.status !== FatteningLotStatus.ACTIVE) {
        throw new BadRequestException("Le lot d'engraissement est introuvable ou n'est plus actif.");
      }
    }
    if (cageId) {
      const cage = await this.prisma.cage.findFirst({ where: { id: cageId, farmId } });
      if (!cage) throw new NotFoundException('Cage introuvable.');
      if (cage.status !== 'ACTIVE') throw new BadRequestException(`La cage ${cage.code} est inactive ou en maintenance.`);
      const occupants = await this.prisma.rabbitCageMovement.count({ where: { cageId, endedAt: null } });
      if (occupants + count > cage.capacity) {
        throw new BadRequestException(
          `La cage ${cage.code} contient déjà ${occupants} lapin(s) pour ${cage.capacity} places : elle ne peut pas recevoir ${count} lapereaux.`,
        );
      }
    }
  }

  /** Une étape avant le sevrage a échoué : on retire ce qui a été créé, pour pouvoir recommencer. */
  private async undo(breedingId: string, birthId: string | null, currentUser: CurrentUserType) {
    if (birthId) {
      await this.prisma.mortalityRecord.deleteMany({ where: { farmId: currentUser.farmId, litter: { birthId } } });
      await this.births.remove(birthId, currentUser);
    }
    await this.prisma.pregnancy.deleteMany({ where: { breedingId, farmId: currentUser.farmId } });
    await this.breedings.remove(breedingId, currentUser);
  }
}
