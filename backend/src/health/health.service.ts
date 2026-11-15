import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CreateHealthRecordInput } from './inputs/create-health-record.input.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';
import { HealthRecordType, TaskSourceType } from '../generated/prisma/client.js';
import { UpdateHealthRecordInput } from './inputs/update-health-record.input.js';

const recordInclude = { rabbit: { select: { code: true, birthLitterId: true, purpose: true } } } as const;

type RecordWithRabbit = {
  rabbit?: { code: string; birthLitterId?: string | null; purpose?: string } | null;
  [key: string]: unknown;
};

/**
 * Module santé (§38-40). Distingue symptôme observé, suspicion
 * et diagnostic confirmé ; une échéance génère une tâche de suivi.
 */
@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasks: TaskAutomationService,
  ) {}

  private toModel<T extends RecordWithRabbit>(record: T) {
    const { rabbit, ...rest } = record;
    return {
      ...rest,
      rabbitCode: rabbit?.code ?? null,
      // Même règle que la liste « Lapereaux » : né à la ferme et en engraissement.
      isKit: Boolean(rabbit?.birthLitterId) && rabbit?.purpose === 'FATTENING',
    };
  }

  async create(input: CreateHealthRecordInput, currentUser: CurrentUserType) {
    const date = new Date(input.date);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('La date est invalide.');
    }

    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: input.rabbitId, farmId: currentUser.farmId },
    });

    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }

    const nextDueDate = input.nextDueDate ? new Date(input.nextDueDate) : null;

    if (nextDueDate && Number.isNaN(nextDueDate.getTime())) {
      throw new BadRequestException('La prochaine échéance est invalide.');
    }

    if (nextDueDate && nextDueDate < date) {
      throw new BadRequestException(
        'La prochaine échéance ne peut pas précéder la date du soin.',
      );
    }

    const hasContent = [
      input.symptoms,
      input.observation,
      input.suspicion,
      input.diagnosis,
      input.treatment,
      input.medication,
    ].some((value) => value?.trim());

    if (!hasContent) {
      throw new BadRequestException(
        'Renseignez au moins un symptôme, une observation, un diagnostic ou un traitement.',
      );
    }

    const type = input.type ?? HealthRecordType.OBSERVATION;

    return this.prisma.$transaction(async (tx) => {
    const record = await tx.healthRecord.create({
      include: recordInclude,
      data: {
        farmId: currentUser.farmId,
        rabbitId: rabbit.id,
        type,
        date,
        createdById: currentUser.userId,
        symptoms: input.symptoms?.trim() || null,
        observation: input.observation?.trim() || null,
        suspicion: input.suspicion?.trim() || null,
        diagnosis: input.diagnosis?.trim() || null,
        treatment: input.treatment?.trim() || null,
        medication: input.medication?.trim() || null,
        dosage: input.dosage?.trim() || null,
        nextDueDate,
      },
    });

    await this.tasks.onHealthRecordCreated(
      currentUser.farmId,
      {
        id: record.id,
        rabbitId: rabbit.id,
        rabbitCode: rabbit.code,
        type,
        nextDueDate,
        treatment: record.treatment,
        medication: record.medication,
      },
      tx,
    );

    return this.toModel(record);
    });
  }

  async findAll(currentUser: CurrentUserType, type?: HealthRecordType) {
    const records = await this.prisma.healthRecord.findMany({
      where: { farmId: currentUser.farmId, ...(type ? { type } : {}) },
      include: recordInclude,
      orderBy: { date: 'desc' },
    });
    return records.map((record) => this.toModel(record));
  }

  /**
   * Traitements, vaccinations et contrôles à venir (dashboard §49.1).
   */
  async upcoming(currentUser: CurrentUserType, days = 7) {
    const now = new Date();
    const limit = new Date(now.getTime() + days * 86_400_000);
    const records = await this.prisma.healthRecord.findMany({
      where: {
        farmId: currentUser.farmId,
        nextDueDate: { not: null, lte: limit },
        rabbit: { status: 'ACTIVE' },
      },
      include: recordInclude,
      orderBy: { nextDueDate: 'asc' },
    });
    return records.map((record) => this.toModel(record));
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const record = await this.prisma.healthRecord.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: recordInclude,
    });
    if (!record) {
      throw new NotFoundException('Fiche sanitaire introuvable.');
    }
    return this.toModel(record);
  }

  async findByRabbit(rabbitId: string, currentUser: CurrentUserType) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: rabbitId, farmId: currentUser.farmId },
      select: { id: true },
    });

    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }

    const records = await this.prisma.healthRecord.findMany({
      where: { rabbitId, farmId: currentUser.farmId },
      include: recordInclude,
      orderBy: { date: 'desc' },
    });
    return records.map((record) => this.toModel(record));
  }

  async update(input: UpdateHealthRecordInput, currentUser: CurrentUserType) {
    const existing = await this.prisma.healthRecord.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
      include: { rabbit: { select: { id: true, code: true } } },
    });
    if (!existing) {
      throw new NotFoundException('Fiche sanitaire introuvable.');
    }
    const date = input.date ? new Date(input.date) : existing.date;
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('La date est invalide.');
    }
    const nextDueDate =
      input.nextDueDate === undefined
        ? existing.nextDueDate
        : input.nextDueDate
          ? new Date(input.nextDueDate)
          : null;
    if (nextDueDate && Number.isNaN(nextDueDate.getTime())) {
      throw new BadRequestException('La prochaine échéance est invalide.');
    }
    if (nextDueDate && nextDueDate < date) {
      throw new BadRequestException(
        'La prochaine échéance ne peut pas précéder la date du soin.',
      );
    }
    const text = (value: string | undefined) =>
      value === undefined ? undefined : value.trim() || null;
    const dueChanged =
      (nextDueDate?.getTime() ?? null) !== (existing.nextDueDate?.getTime() ?? null);

    return this.prisma.$transaction(async (tx) => {
      const record = await tx.healthRecord.update({
        where: { id: existing.id },
        include: recordInclude,
        data: {
          type: input.type ?? undefined,
          date,
          symptoms: text(input.symptoms),
          observation: text(input.observation),
          suspicion: text(input.suspicion),
          diagnosis: text(input.diagnosis),
          treatment: text(input.treatment),
          medication: text(input.medication),
          dosage: text(input.dosage),
          nextDueDate,
        },
      });
      if (dueChanged) {
        // L'échéance a changé : la tâche de suivi est recréée.
        await this.tasks.removeOpenTasksForSource(
          currentUser.farmId,
          TaskSourceType.HEALTH,
          record.id,
          tx,
        );
        await this.tasks.onHealthRecordCreated(
          currentUser.farmId,
          {
            id: record.id,
            rabbitId: existing.rabbit.id,
            rabbitCode: existing.rabbit.code,
            type: record.type,
            nextDueDate,
            treatment: record.treatment,
            medication: record.medication,
          },
          tx,
        );
      }
      return this.toModel(record);
    });
  }

  async remove(id: string, currentUser: CurrentUserType) {
    const existing = await this.prisma.healthRecord.findFirst({
      where: { id, farmId: currentUser.farmId },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Fiche sanitaire introuvable.');
    }
    await this.prisma.$transaction(async (tx) => {
      await this.tasks.removeOpenTasksForSource(
        currentUser.farmId,
        TaskSourceType.HEALTH,
        existing.id,
        tx,
      );
      await tx.healthRecord.delete({ where: { id: existing.id } });
    });
    return true;
  }
}
