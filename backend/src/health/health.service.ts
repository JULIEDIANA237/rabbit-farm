import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CreateHealthRecordInput } from './inputs/create-health-record.input.js';
import { TaskAutomationService } from '../operations/automation/task-automation.service.js';
import { HealthRecordType } from '../generated/prisma/client.js';

const recordInclude = { rabbit: { select: { code: true } } } as const;

type RecordWithRabbit = { rabbit?: { code: string } | null; [key: string]: unknown };

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
    return { ...rest, rabbitCode: rabbit?.code ?? null };
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
}
