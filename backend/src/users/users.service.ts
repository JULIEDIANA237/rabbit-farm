import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { FarmRole } from '../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { AddMemberInput } from './inputs/add-member.input';
import { UpdateMemberRoleInput } from './inputs/update-member-role.input';

import { CurrentUserType } from '../auth/types/current-user.type';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Retourne les membres de la ferme courante.
   */
  async findFarmMembers(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.farmMembership.findMany({
      where: {
        farmId: currentUser.farmId,
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Ajoute un utilisateur existant
   * à la ferme courante.
   */
  async addMember(
    input: AddMemberInput,
    currentUser: CurrentUserType,
  ) {
    const email = input.email
      .trim()
      .toLowerCase();

    /**
     * Recherche de l'utilisateur global.
     */
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Aucun utilisateur ne possède cette adresse e-mail. ' +
          'L’utilisateur doit d’abord créer son compte.',
      );
    }

    /**
     * Un utilisateur désactivé ne peut pas
     * être ajouté à une ferme.
     */
    if (!user.isActive) {
      throw new ConflictException(
        'Cet utilisateur est désactivé.',
      );
    }

    /**
     * Vérifie si l'utilisateur est déjà
     * membre de cette ferme.
     */
    const existingMembership =
      await this.prisma.farmMembership.findUnique({
        where: {
          userId_farmId: {
            userId: user.id,
            farmId: currentUser.farmId,
          },
        },
      });

    if (existingMembership) {
      throw new ConflictException(
        'Cet utilisateur est déjà membre de cette ferme.',
      );
    }

    /**
     * Création de l'appartenance.
     */
    return this.prisma.farmMembership.create({
      data: {
        userId: user.id,
        farmId: currentUser.farmId,
        role: input.role,
      },

      include: {
        user: true,
      },
    });
  }

  /**
   * Modification du rôle d'un membre.
   */
  async updateMemberRole(
    input: UpdateMemberRoleInput,
    currentUser: CurrentUserType,
  ) {
    /**
     * Le membership doit appartenir
     * à la ferme courante.
     */
    const membership =
      await this.prisma.farmMembership.findFirst({
        where: {
          id: input.membershipId,
          farmId: currentUser.farmId,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Membre introuvable dans cette ferme.',
      );
    }

    /**
     * Protection du dernier ADMIN.
     *
     * Si on change le rôle d'un ADMIN vers
     * un rôle inférieur, il faut vérifier
     * qu'il existe un autre ADMIN.
     */
    if (
      membership.role === FarmRole.ADMIN &&
      input.role !== FarmRole.ADMIN
    ) {
      const adminCount =
        await this.prisma.farmMembership.count({
          where: {
            farmId: currentUser.farmId,
            role: FarmRole.ADMIN,
          },
        });

      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Impossible de retirer le rôle ADMIN au dernier administrateur de la ferme.',
        );
      }
    }

    return this.prisma.farmMembership.update({
      where: {
        id: membership.id,
      },

      data: {
        role: input.role,
      },

      include: {
        user: true,
      },
    });
  }

  /**
   * Supprime un membre de la ferme courante.
   */
  async removeMember(
    membershipId: string,
    currentUser: CurrentUserType,
  ) {
    /**
     * Vérifie que le membership appartient
     * à la ferme courante.
     */
    const membership =
      await this.prisma.farmMembership.findFirst({
        where: {
          id: membershipId,
          farmId: currentUser.farmId,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Membre introuvable dans cette ferme.',
      );
    }

    /**
     * Empêche un ADMIN de supprimer
     * le dernier ADMIN.
     */
    if (membership.role === FarmRole.ADMIN) {
      const adminCount =
        await this.prisma.farmMembership.count({
          where: {
            farmId: currentUser.farmId,
            role: FarmRole.ADMIN,
          },
        });

      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Impossible de supprimer le dernier administrateur de la ferme.',
        );
      }
    }

    /**
     * Suppression uniquement de l'appartenance
     * à la ferme.
     *
     * Le compte User global n'est PAS supprimé.
     */
    return this.prisma.farmMembership.delete({
      where: {
        id: membership.id,
      },

      include: {
        user: true,
      },
    });
  }
}