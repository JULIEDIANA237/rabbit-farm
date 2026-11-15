import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { UpdateRabbitHistoryInput } from './inputs/update-rabbit-history.input.js';

/**
 * Corrections de l'historique d'un lapin (§54) : date ou observation
 * d'un placement en cage, entrée dans un lot, sortie ; suppression
 * d'une ligne saisie par erreur. Les pesées, soins, saillies, ventes et
 * sorties (cancelRabbitExit) se corrigent avec leurs propres mutations.
 */
@Injectable()
export class RabbitHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async findRabbit(rabbitId: string, currentUser: CurrentUserType) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: rabbitId, farmId: currentUser.farmId },
    });
    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }
    return rabbit;
  }

  private parseDate(value: Date | string, birthDate?: Date | null) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date invalide.');
    }
    if (date.getTime() > Date.now() + 60_000) {
      throw new BadRequestException('La date ne peut pas être dans le futur.');
    }
    if (birthDate && date < birthDate) {
      throw new BadRequestException('La date ne peut pas précéder la naissance.');
    }
    return date;
  }

  async update(input: UpdateRabbitHistoryInput, currentUser: CurrentUserType) {
    const rabbit = await this.findRabbit(input.rabbitId, currentUser);
    const date = this.parseDate(input.date, rabbit.birthDate);
    const note = input.note === undefined ? undefined : input.note?.trim() || null;

    switch (input.type) {
      case 'CAGE': {
        const movement = await this.prisma.rabbitCageMovement.findFirst({
          where: { id: input.recordId, rabbitId: rabbit.id },
        });
        if (!movement) throw new NotFoundException('Placement introuvable.');
        if (movement.endedAt && date > movement.endedAt) {
          throw new BadRequestException('La date d’entrée doit précéder la sortie de cette cage.');
        }
        await this.prisma.$transaction([
          // La cage précédente se termine à la nouvelle date d'entrée.
          this.prisma.rabbitCageMovement.updateMany({
            where: { rabbitId: rabbit.id, endedAt: movement.startedAt, id: { not: movement.id } },
            data: { endedAt: date },
          }),
          this.prisma.rabbitCageMovement.update({
            where: { id: movement.id },
            data: { startedAt: date, observation: note },
          }),
        ]);
        return true;
      }
      case 'LOT': {
        const membership = await this.prisma.lotMembership.findFirst({
          where: { id: input.recordId, rabbitId: rabbit.id },
        });
        if (!membership) throw new NotFoundException('Entrée dans le lot introuvable.');
        if (membership.leftAt && date > membership.leftAt) {
          throw new BadRequestException('La date d’entrée doit précéder la sortie du lot.');
        }
        await this.prisma.lotMembership.update({
          where: { id: membership.id },
          data: { joinedAt: date },
        });
        return true;
      }
      case 'EXIT': {
        if (rabbit.status === 'ACTIVE' || rabbit.status === 'SOLD') {
          throw new ConflictException('Ce lapin n’a pas de sortie à modifier.');
        }
        await this.prisma.$transaction([
          this.prisma.rabbit.update({
            where: { id: rabbit.id },
            data: { exitDate: date, exitCause: note },
          }),
          this.prisma.mortalityRecord.updateMany({
            where: { farmId: currentUser.farmId, rabbitId: rabbit.id, scope: 'RABBIT' },
            data: { date, ...(note !== undefined ? { cause: note } : {}) },
          }),
        ]);
        return true;
      }
      default:
        throw new BadRequestException('Cet événement se modifie depuis sa propre page.');
    }
  }

  async remove(rabbitId: string, type: string, recordId: string, currentUser: CurrentUserType) {
    const rabbit = await this.findRabbit(rabbitId, currentUser);

    switch (type) {
      case 'CAGE': {
        const movement = await this.prisma.rabbitCageMovement.findFirst({
          where: { id: recordId, rabbitId: rabbit.id },
        });
        if (!movement) throw new NotFoundException('Placement introuvable.');
        await this.prisma.$transaction(async (tx) => {
          await tx.rabbitCageMovement.delete({ where: { id: movement.id } });
          // Placement actuel effacé : le lapin retourne dans sa cage précédente.
          if (!movement.endedAt && rabbit.status === 'ACTIVE') {
            const previous = await tx.rabbitCageMovement.findFirst({
              where: { rabbitId: rabbit.id, endedAt: movement.startedAt },
              orderBy: { startedAt: 'desc' },
            });
            if (previous) {
              await tx.rabbitCageMovement.update({ where: { id: previous.id }, data: { endedAt: null } });
            }
          }
        });
        return true;
      }
      case 'LOT': {
        const { count } = await this.prisma.lotMembership.deleteMany({
          where: { id: recordId, rabbitId: rabbit.id },
        });
        if (!count) throw new NotFoundException('Entrée dans le lot introuvable.');
        return true;
      }
      case 'WEANING': {
        const { count } = await this.prisma.weaningRabbit.deleteMany({
          where: { id: recordId, rabbitId: rabbit.id },
        });
        if (!count) throw new NotFoundException('Sevrage introuvable.');
        return true;
      }
      case 'ADOPTION': {
        const { count } = await this.prisma.adoptionRabbit.deleteMany({
          where: { id: recordId, rabbitId: rabbit.id },
        });
        if (!count) throw new NotFoundException('Adoption introuvable.');
        return true;
      }
      default:
        throw new BadRequestException('Cet événement se supprime depuis sa propre page.');
    }
  }
}
