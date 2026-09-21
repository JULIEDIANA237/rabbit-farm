import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreateHealthRecordInput } from './inputs/create-health-record.input';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.healthRecord.create({
      data: {
        farmId: currentUser.farmId,
        rabbitId: rabbit.id,
        date,
        createdById: currentUser.userId,
        symptoms: input.symptoms?.trim() || null,
        observation: input.observation?.trim() || null,
        suspicion: input.suspicion?.trim() || null,
        diagnosis: input.diagnosis?.trim() || null,
        treatment: input.treatment?.trim() || null,
        medication: input.medication?.trim() || null,
        dosage: input.dosage?.trim() || null,
        nextDueDate: input.nextDueDate ? new Date(input.nextDueDate) : null,
      },
    });
  }

  findAll(currentUser: CurrentUserType) {
    return this.prisma.healthRecord.findMany({
      where: { farmId: currentUser.farmId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const record = await this.prisma.healthRecord.findFirst({
      where: { id, farmId: currentUser.farmId },
    });

    if (!record) {
      throw new NotFoundException('Fiche sanitaire introuvable.');
    }

    return record;
  }

  async findByRabbit(rabbitId: string, currentUser: CurrentUserType) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: rabbitId, farmId: currentUser.farmId },
      select: { id: true },
    });

    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }

    return this.prisma.healthRecord.findMany({
      where: { rabbitId, farmId: currentUser.farmId },
      orderBy: { date: 'desc' },
    });
  }
}
