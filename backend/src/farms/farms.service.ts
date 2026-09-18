import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFarmInput } from './dto/create-farm.input';

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
}