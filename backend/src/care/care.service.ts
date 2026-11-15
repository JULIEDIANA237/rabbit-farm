import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CareScope, TaskPriority, TaskSourceType, TaskStatus } from '../generated/prisma/client.js';

import type { CreateCareRecordInput, UpdateCareRecordInput } from './care.graphql.js';

const CARE_TASK_KEY = 'CARE_NEXT';

const careInclude = {
  section: { select: { name: true } },
  cage: { select: { code: true } },
  lot: { select: { code: true } },
  rabbit: { select: { code: true } },
} as const;

type CareWithTarget = {
  scope: CareScope;
  section: { name: string } | null;
  cage: { code: string } | null;
  lot: { code: string } | null;
  rabbit: { code: string } | null;
};

export function careTargetLabel(record: CareWithTarget) {
  switch (record.scope) {
    case CareScope.SECTION:
      return record.section ? `Bloc ${record.section.name}` : 'Bloc supprimé';
    case CareScope.CAGE:
      return record.cage ? `Cage ${record.cage.code}` : 'Cage supprimée';
    case CareScope.LOT:
      return record.lot ? `Lot ${record.lot.code}` : 'Lot supprimé';
    case CareScope.RABBIT:
      return record.rabbit ? `Lapin ${record.rabbit.code}` : 'Lapin supprimé';
    default:
      return 'Toute la ferme';
  }
}

@Injectable()
export class CareService {
  constructor(private readonly prisma: PrismaService) {}

  private toModel<T extends CareWithTarget>(record: T) {
    const { section, cage, lot, rabbit, ...rest } = record;
    return { ...rest, targetLabel: careTargetLabel({ scope: record.scope, section, cage, lot, rabbit }) };
  }

  async list(currentUser: CurrentUserType, from?: Date) {
    const records = await this.prisma.careRecord.findMany({
      where: { farmId: currentUser.farmId, ...(from ? { date: { gte: from } } : {}) },
      include: careInclude,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 500,
    });
    return records.map((r) => this.toModel(r));
  }

  /** Vérifie la cible et ne garde que l'identifiant qui correspond à la portée. */
  private async target(
    scope: CareScope,
    ids: { sectionId?: string | null; cageId?: string | null; lotId?: string | null; rabbitId?: string | null },
    farmId: string,
  ) {
    const empty = { sectionId: null, cageId: null, lotId: null, rabbitId: null };
    const check = async (found: unknown, what: string) => {
      if (!found) throw new BadRequestException(`Choisis ${what} qui a reçu le soin.`);
    };
    switch (scope) {
      case CareScope.SECTION:
        await check(ids.sectionId && (await this.prisma.section.findFirst({ where: { id: ids.sectionId, farmId } })), 'le bloc');
        return { ...empty, sectionId: ids.sectionId! };
      case CareScope.CAGE:
        await check(ids.cageId && (await this.prisma.cage.findFirst({ where: { id: ids.cageId, farmId } })), 'la cage');
        return { ...empty, cageId: ids.cageId! };
      case CareScope.LOT:
        await check(ids.lotId && (await this.prisma.fatteningLot.findFirst({ where: { id: ids.lotId, farmId } })), 'le lot');
        return { ...empty, lotId: ids.lotId! };
      case CareScope.RABBIT:
        await check(ids.rabbitId && (await this.prisma.rabbit.findFirst({ where: { id: ids.rabbitId, farmId } })), 'le lapin');
        return { ...empty, rabbitId: ids.rabbitId! };
      default:
        return empty;
    }
  }

  private validate(date: Date, nextDate: Date | null | undefined, animalCount: number | null | undefined) {
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Date du soin invalide.');
    if (date.getTime() > Date.now() + 86_400_000) throw new BadRequestException('Le soin ne peut pas être dans le futur.');
    if (nextDate && nextDate < date) {
      throw new BadRequestException('Le prochain soin doit être après celui-ci.');
    }
    if (animalCount != null && (!Number.isInteger(animalCount) || animalCount < 0)) {
      throw new BadRequestException('Le nombre de lapins doit être un entier positif.');
    }
  }

  private text(value: string | null | undefined) {
    return value === undefined ? undefined : value?.trim() || null;
  }

  /** Rappel du prochain soin : une tâche ouverte, remplacée à chaque modification. */
  private async syncTask(
    farmId: string,
    record: { id: string; careType: string; nextDate: Date | null; rabbitId: string | null; product: string | null },
    targetLabel: string,
  ) {
    await this.prisma.task.deleteMany({
      where: {
        farmId,
        sourceType: TaskSourceType.HEALTH,
        sourceId: record.id,
        automationKey: CARE_TASK_KEY,
        status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
      },
    });
    if (!record.nextDate) return;
    await this.prisma.task.create({
      data: {
        farmId,
        title: `Soin : ${record.careType} (${targetLabel})`,
        description: record.product ? `Produit : ${record.product}.` : null,
        dueDate: record.nextDate,
        priority: TaskPriority.MEDIUM,
        sourceType: TaskSourceType.HEALTH,
        sourceId: record.id,
        rabbitId: record.rabbitId,
        automationKey: CARE_TASK_KEY,
      },
    });
  }

  async create(input: CreateCareRecordInput, currentUser: CurrentUserType) {
    const careType = input.careType.trim();
    if (!careType) throw new BadRequestException('Indique le soin donné.');
    const date = new Date(input.date);
    const nextDate = input.nextDate ? new Date(input.nextDate) : null;
    this.validate(date, nextDate, input.animalCount);
    const scope = input.scope ?? CareScope.FARM;
    const target = await this.target(scope, input, currentUser.farmId);
    const record = await this.prisma.careRecord.create({
      data: {
        farmId: currentUser.farmId,
        date,
        careType,
        scope,
        ...target,
        product: this.text(input.product) ?? null,
        dose: this.text(input.dose) ?? null,
        animalCount: input.animalCount ?? null,
        notes: this.text(input.notes) ?? null,
        nextDate,
        createdById: currentUser.userId ?? null,
      },
      include: careInclude,
    });
    const model = this.toModel(record);
    await this.syncTask(currentUser.farmId, record, model.targetLabel);
    return model;
  }

  private async findOrFail(id: string, farmId: string) {
    const record = await this.prisma.careRecord.findFirst({ where: { id, farmId } });
    if (!record) throw new NotFoundException('Soin introuvable.');
    return record;
  }

  async update(input: UpdateCareRecordInput, currentUser: CurrentUserType) {
    const existing = await this.findOrFail(input.id, currentUser.farmId);
    const careType = input.careType === undefined ? undefined : input.careType.trim();
    if (careType === '') throw new BadRequestException('Indique le soin donné.');
    const date = input.date ? new Date(input.date) : existing.date;
    const nextDate = input.nextDate === undefined ? existing.nextDate : input.nextDate ? new Date(input.nextDate) : null;
    const animalCount = input.animalCount === undefined ? existing.animalCount : input.animalCount;
    this.validate(date, nextDate, animalCount);
    const scope = input.scope ?? existing.scope;
    const target = await this.target(
      scope,
      {
        sectionId: input.sectionId ?? existing.sectionId,
        cageId: input.cageId ?? existing.cageId,
        lotId: input.lotId ?? existing.lotId,
        rabbitId: input.rabbitId ?? existing.rabbitId,
      },
      currentUser.farmId,
    );
    const record = await this.prisma.careRecord.update({
      where: { id: existing.id },
      data: {
        date,
        careType,
        scope,
        ...target,
        product: this.text(input.product),
        dose: this.text(input.dose),
        animalCount,
        notes: this.text(input.notes),
        nextDate,
      },
      include: careInclude,
    });
    const model = this.toModel(record);
    await this.syncTask(currentUser.farmId, record, model.targetLabel);
    return model;
  }

  async remove(id: string, currentUser: CurrentUserType) {
    const existing = await this.findOrFail(id, currentUser.farmId);
    await this.prisma.$transaction([
      this.prisma.task.deleteMany({
        where: {
          farmId: currentUser.farmId,
          sourceType: TaskSourceType.HEALTH,
          sourceId: existing.id,
          automationKey: CARE_TASK_KEY,
          status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
        },
      }),
      this.prisma.careRecord.delete({ where: { id: existing.id } }),
    ]);
    return true;
  }
}
