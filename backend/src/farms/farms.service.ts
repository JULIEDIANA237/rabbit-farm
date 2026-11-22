import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateFarmInput } from './dto/create-farm.input.js';
import { UpdateFarmInput } from './dto/update-farm.input.js';

import { CurrentUserType } from '../auth/types/current-user.type.js';
import { farmResetCounts, resetFarmRecords } from './farm-reset.js';

@Injectable()
export class FarmsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Création d'une ferme.
   *
   * Attention :
   * dans notre architecture actuelle, la création
   * de la première ferme est normalement réalisée
   * pendant le REGISTER.
   */
  async create(input: CreateFarmInput) {
    return this.prisma.farm.create({
      data: {
        name: input.name,
        description: input.description,
        location: input.location,
      },
    });
  }

  /**
   * Récupère la ferme actuellement associée
   * au JWT de l'utilisateur.
   */
  async findAll(user: CurrentUserType) {
    return this.prisma.farm.findMany({
      where: {
        id: user.farmId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Récupère une ferme uniquement si
   * l'utilisateur en est membre.
   *
   * Cela évite qu'un utilisateur puisse
   * accéder à une autre ferme simplement
   * en connaissant son UUID.
   */
  async findOne(
    id: string,
    user: CurrentUserType,
  ) {
    return this.prisma.farm.findFirst({
      where: {
        id,

        memberships: {
          some: {
            userId: user.userId,
          },
        },
      },
    });
  }

  /**
   * Mise à jour de la ferme courante (nom, localisation,
   * politique de consanguinité).
   */
  async updateCurrent(input: UpdateFarmInput, user: CurrentUserType) {
    const farm = await this.prisma.farm.findUnique({ where: { id: user.farmId } });

    if (!farm) {
      throw new NotFoundException('Ferme introuvable.');
    }

    if (input.name !== undefined && !input.name.trim()) {
      throw new BadRequestException('Le nom de la ferme est obligatoire.');
    }

    return this.prisma.farm.update({
      where: { id: farm.id },
      data: {
        name: input.name?.trim(),
        description:
          input.description !== undefined ? input.description.trim() || null : undefined,
        location:
          input.location !== undefined ? input.location.trim() || null : undefined,
        inbreedingPolicy: input.inbreedingPolicy,
      },
    });
  }

  async me(user: CurrentUserType) {
    // Dernière activité (pour compter les utilisateurs actifs), au plus une fois par heure.
    const hourAgo = new Date(Date.now() - 3_600_000);
    void this.prisma.user
      ?.updateMany({ where: { id: user.userId, OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: hourAgo } }] }, data: { lastSeenAt: new Date() } })
      ?.catch(() => undefined);

    const membership = await this.prisma.farmMembership.findFirst({
      where: { userId: user.userId, farmId: user.farmId },
      include: { user: true, farm: true },
    });

    if (!membership) {
      throw new NotFoundException('Utilisateur introuvable dans cette ferme.');
    }

    return {
      userId: membership.user.id,
      email: membership.user.email,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      role: membership.role,
      farm: membership.farm,
    };
  }

  /** Ce que le bouton « Réinitialiser » effacerait, avec les nombres. */
  async resetPreview(user: CurrentUserType) {
    return farmResetCounts(this.prisma, user.farmId);
  }

  /**
   * Remet l'élevage à zéro : tout est effacé sauf les lapins adultes,
   * les tâches, le stock et les dépenses (voir resetFarmRecords).
   * Il faut taper « RÉINITIALISER » pour confirmer.
   */
  async reset(confirmation: string, user: CurrentUserType) {
    const typed = confirmation.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
    if (typed !== 'REINITIALISER') {
      throw new BadRequestException('Tape RÉINITIALISER pour confirmer.');
    }
    const counts = await farmResetCounts(this.prisma, user.farmId);
    await this.prisma.$transaction((tx) => resetFarmRecords(tx, user.farmId), { timeout: 60_000 });
    return counts;
  }
}
