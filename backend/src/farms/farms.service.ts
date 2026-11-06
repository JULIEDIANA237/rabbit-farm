import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFarmInput } from './dto/create-farm.input';
import { UpdateFarmInput } from './dto/update-farm.input';

import { CurrentUserType } from '../auth/types/current-user.type';

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
}