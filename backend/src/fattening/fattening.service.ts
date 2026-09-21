import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  FatteningLotStatus,
  RabbitStatus,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreateFatteningLotInput } from './inputs/create-fattening-lot.input';
import { AddLotMembersInput } from './inputs/add-lot-members.input';
import { RemoveLotMembersInput } from './inputs/remove-lot-members.input';
import { CompleteFatteningLotInput } from './inputs/complete-fattening-lot.input';
import { CreateWeighingInput } from './inputs/create-weighing.input';

@Injectable()
export class FatteningService {
  constructor(private readonly prisma: PrismaService) {}

  private validateDate(date: Date, fieldName: string) {
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`La date ${fieldName} est invalide.`);
    }
  }

  async createLot(input: CreateFatteningLotInput, currentUser: CurrentUserType) {
    const code = input.code.trim().toUpperCase();
    const entryDate = new Date(input.entryDate);

    if (!code) {
      throw new BadRequestException('Le code du lot est obligatoire.');
    }

    this.validateDate(entryDate, "d'entrée");

    const existing = await this.prisma.fatteningLot.findUnique({
      where: {
        farmId_code: {
          farmId: currentUser.farmId,
          code,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ce lot existe déjà.');
    }

    return this.prisma.fatteningLot.create({
      data: {
        farmId: currentUser.farmId,
        code,
        entryDate,
        observation: input.observation?.trim() || null,
      },
    });
  }

  findLots(currentUser: CurrentUserType) {
    return this.prisma.fatteningLot.findMany({
      where: { farmId: currentUser.farmId },
      orderBy: { entryDate: 'desc' },
    });
  }

  async findLot(id: string, currentUser: CurrentUserType) {
    const lot = await this.prisma.fatteningLot.findFirst({
      where: { id, farmId: currentUser.farmId },
    });

    if (!lot) {
      throw new NotFoundException('Lot introuvable.');
    }

    return lot;
  }

  async addMembers(input: AddLotMembersInput, currentUser: CurrentUserType) {
    const rabbitIds = [...new Set(input.rabbitIds)];

    if (!rabbitIds.length) {
      throw new BadRequestException('Au moins un lapin doit être sélectionné.');
    }

    const lot = await this.prisma.fatteningLot.findFirst({
      where: { id: input.lotId, farmId: currentUser.farmId },
    });

    if (!lot) {
      throw new NotFoundException('Lot introuvable.');
    }

    if (lot.status !== FatteningLotStatus.ACTIVE) {
      throw new BadRequestException('Le lot n’est plus actif.');
    }

    const rabbits = await this.prisma.rabbit.findMany({
      where: {
        id: { in: rabbitIds },
        farmId: currentUser.farmId,
        status: RabbitStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (rabbits.length !== rabbitIds.length) {
      throw new BadRequestException(
        'Un ou plusieurs lapins sont introuvables ou inactifs.',
      );
    }

    const activeMemberships = await this.prisma.lotMembership.findMany({
      where: {
        rabbitId: { in: rabbitIds },
        leftAt: null,
      },
      select: { rabbitId: true },
    });

    if (activeMemberships.length) {
      throw new ConflictException(
        'Un lapin sélectionné appartient déjà à un lot actif.',
      );
    }

    return this.prisma.$transaction(
      rabbitIds.map((rabbitId) =>
        this.prisma.lotMembership.create({
          data: {
            lotId: lot.id,
            rabbitId,
            joinedAt: new Date(),
            reason: input.reason?.trim() || null,
          },
        }),
      ),
    );
  }

  async removeMembers(
    input: RemoveLotMembersInput,
    currentUser: CurrentUserType,
  ) {
    const rabbitIds = [...new Set(input.rabbitIds)];

    if (!rabbitIds.length) {
      throw new BadRequestException('Au moins un lapin doit être sélectionné.');
    }

    await this.findLot(input.lotId, currentUser);

    const memberships = await this.prisma.lotMembership.findMany({
      where: {
        lotId: input.lotId,
        rabbitId: { in: rabbitIds },
        leftAt: null,
      },
    });

    if (memberships.length !== rabbitIds.length) {
      throw new BadRequestException(
        'Un ou plusieurs lapins ne sont pas membres actifs de ce lot.',
      );
    }

    const leftAt = new Date();
    const reason = input.reason?.trim() || null;

    return this.prisma.$transaction(
      memberships.map((membership) =>
        this.prisma.lotMembership.update({
          where: { id: membership.id },
          data: { leftAt, reason },
        }),
      ),
    );
  }

  async completeLot(
    input: CompleteFatteningLotInput,
    currentUser: CurrentUserType,
  ) {
    const lot = await this.findLot(input.id, currentUser);

    if (lot.status !== FatteningLotStatus.ACTIVE) {
      throw new ConflictException('Ce lot est déjà clôturé.');
    }

    const exitDate = new Date(input.exitDate ?? Date.now());
    this.validateDate(exitDate, 'de sortie');

    return this.prisma.$transaction(async (tx) => {
      await tx.lotMembership.updateMany({
        where: { lotId: lot.id, leftAt: null },
        data: { leftAt: exitDate, reason: 'Clôture du lot' },
      });

      return tx.fatteningLot.update({
        where: { id: lot.id },
        data: {
          status: FatteningLotStatus.COMPLETED,
          exitDate,
          observation: input.observation?.trim() || lot.observation,
        },
      });
    });
  }

  memberships(lotId: string, currentUser: CurrentUserType) {
    return this.prisma.lotMembership.findMany({
      where: {
        lotId,
        lot: { farmId: currentUser.farmId },
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async createWeighing(
    input: CreateWeighingInput,
    currentUser: CurrentUserType,
  ) {
    if (!input.rabbitId && !input.lotId) {
      throw new BadRequestException('Un lapin ou un lot doit être renseigné.');
    }

    if (input.totalWeight <= 0 || input.animalCount <= 0) {
      throw new BadRequestException(
        'Le poids et le nombre d’animaux doivent être positifs.',
      );
    }

    const date = new Date(input.date);
    this.validateDate(date, 'de pesée');

    if (input.rabbitId) {
      const rabbit = await this.prisma.rabbit.findFirst({
        where: { id: input.rabbitId, farmId: currentUser.farmId },
      });

      if (!rabbit) {
        throw new NotFoundException('Lapin introuvable.');
      }
    }

    if (input.lotId) {
      await this.findLot(input.lotId, currentUser);
    }

    return this.prisma.weighing.create({
      data: {
        rabbitId: input.rabbitId,
        lotId: input.lotId,
        date,
        totalWeight: input.totalWeight,
        animalCount: input.animalCount,
        averageWeight:
          input.averageWeight ?? input.totalWeight / input.animalCount,
        ageInDays: input.ageInDays,
        observation: input.observation?.trim() || null,
      },
    });
  }

  weighings(currentUser: CurrentUserType) {
    return this.prisma.weighing.findMany({
      where: {
        OR: [
          { rabbit: { farmId: currentUser.farmId } },
          { lot: { farmId: currentUser.farmId } },
        ],
      },
      orderBy: { date: 'desc' },
    });
  }
}
