import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { AUTOMATION_KEYS } from '../operations/automation/task-planner.js';

import type { AssessRematingInput } from './remating.models.js';
import { assessRemating, type BodyCondition, type VulvaColor } from './remating-rules.js';

const DAY = 86_400_000;
const CONDITIONS: BodyCondition[] = ['THIN', 'GOOD', 'FAT'];
const VULVAS: VulvaColor[] = ['PALE', 'PINK', 'RED', 'UNKNOWN'];

@Injectable()
export class RematingService {
  constructor(private readonly prisma: PrismaService) {}

  async context(femaleId: string, user: CurrentUserType, now = new Date()) {
    const female = await this.prisma.rabbit.findFirst({
      where: { id: femaleId, farmId: user.farmId, sex: 'FEMALE' },
      select: { id: true, code: true, weight: true },
    });
    if (!female) throw new NotFoundException('Femelle introuvable.');
    const [birth, litters, task] = await Promise.all([
      this.prisma.birth.findFirst({ where: { motherId: female.id, farmId: user.farmId }, orderBy: { birthDate: 'desc' }, select: { birthDate: true } }),
      this.prisma.litter.findMany({ where: { motherId: female.id, farmId: user.farmId, status: 'ACTIVE' }, select: { currentCount: true } }),
      this.prisma.task.findFirst({
        where: { farmId: user.farmId, rabbitId: female.id, automationKey: AUTOMATION_KEYS.BIRTH_REMATING, status: { in: ['TODO', 'IN_PROGRESS'] } },
        orderBy: { dueDate: 'desc' },
        select: { id: true },
      }),
    ]);
    return {
      femaleId: female.id,
      femaleCode: female.code,
      lastBirthDate: birth?.birthDate ?? null,
      daysSinceBirth: birth ? Math.floor((now.getTime() - birth.birthDate.getTime()) / DAY) : null,
      kitsNursing: litters.reduce((s, l) => s + l.currentCount, 0),
      lastWeightKg: female.weight != null ? Number(female.weight) : null,
      taskId: task?.id ?? null,
    };
  }

  /** Verdict du questionnaire ; met à jour le poids et la tâche « ressaillie ». */
  async assess(input: AssessRematingInput, user: CurrentUserType, now = new Date()) {
    if (!CONDITIONS.includes(input.bodyCondition as BodyCondition)) throw new BadRequestException('État corporel inconnu.');
    if (!VULVAS.includes(input.vulva as VulvaColor)) throw new BadRequestException('Couleur de vulve inconnue.');
    if (input.weightKg != null && (!(input.weightKg > 0) || input.weightKg > 15)) {
      throw new BadRequestException('Le poids doit être compris entre 0 et 15 kg.');
    }
    const ctx = await this.context(input.femaleId, user, now);
    const result = assessRemating(
      {
        weightKg: input.weightKg,
        bodyCondition: input.bodyCondition as BodyCondition,
        mastitis: input.mastitis,
        sick: input.sick,
        goodAppetite: input.goodAppetite,
        vulva: input.vulva as VulvaColor,
      },
      // Sans mise bas connue, l'éleveur juge lui-même du délai.
      { daysSinceBirth: ctx.daysSinceBirth ?? 99, kitsNursing: ctx.kitsNursing, previousWeightKg: ctx.lastWeightKg },
    );

    let nextCheck: Date | null = null;
    await this.prisma.$transaction(async (tx) => {
      if (input.weightKg != null) await tx.rabbit.update({ where: { id: ctx.femaleId }, data: { weight: input.weightKg } });
      if (!ctx.taskId) return;
      const note = `Questionnaire du ${now.toLocaleDateString('fr-FR')} : ${result.title}. ${result.reasons.join(' ')}`;
      if (result.verdict === 'READY') {
        await tx.task.update({ where: { id: ctx.taskId }, data: { status: 'COMPLETED', completedAt: now, description: note } });
      } else {
        nextCheck = new Date(now.getTime() + result.waitDays * DAY);
        await tx.task.update({ where: { id: ctx.taskId }, data: { dueDate: nextCheck, description: note } });
      }
    });
    return { ...result, nextCheck };
  }
}
