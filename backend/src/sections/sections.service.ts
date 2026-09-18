import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CurrentUserType } from '../auth/types/current-user.type';

import { CreateSectionInput } from './inputs/create-section.input';
import { UpdateSectionInput } from './inputs/update-section.input';

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private toSectionModel<T extends { _count: { cages: number } }>(
    section: T,
  ) {
    const { _count, ...sectionData } = section;

    return {
      ...sectionData,
      cageCount: _count.cages,
    };
  }

  /**
   * Création d'une section dans la ferme courante.
   */
  async create(
    input: CreateSectionInput,
    currentUser: CurrentUserType,
  ) {
    const name = input.name.trim();

    if (!name) {
      throw new ConflictException(
        'Le nom de la section est obligatoire.',
      );
    }

    const existing =
      await this.prisma.section.findUnique({
        where: {
          farmId_name: {
            farmId: currentUser.farmId,
            name,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Une section portant ce nom existe déjà dans cette ferme.',
      );
    }

    const section = await this.prisma.section.create({
      data: {
        farmId: currentUser.farmId,
        name,
        type: input.type,
        description: input.description,
      },

      include: {
        _count: {
          select: {
            cages: true,
          },
        },
      },
    });

    return this.toSectionModel(section);
  }

  /**
   * Liste les sections de la ferme courante.
   */
  async findAll(
    currentUser: CurrentUserType,
  ) {
    const sections = await this.prisma.section.findMany({
      where: {
        farmId: currentUser.farmId,
      },

      include: {
        _count: {
          select: {
            cages: true,
          },
        },
      },

      orderBy: {
        name: 'asc',
      },
    });

    return sections.map((section) =>
      this.toSectionModel(section),
    );
  }

  /**
   * Récupère une section de la ferme courante.
   */
  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const section =
      await this.prisma.section.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },

        include: {
          _count: {
            select: {
              cages: true,
            },
          },
        },
      });

    if (!section) {
      throw new NotFoundException(
        'Section introuvable.',
      );
    }

    return this.toSectionModel(section);
  }

  /**
   * Modification d'une section.
   */
  async update(
    input: UpdateSectionInput,
    currentUser: CurrentUserType,
  ) {
    const section =
      await this.prisma.section.findFirst({
        where: {
          id: input.id,
          farmId: currentUser.farmId,
        },
      });

    if (!section) {
      throw new NotFoundException(
        'Section introuvable.',
      );
    }

    if (input.name !== undefined) {
      const name = input.name.trim();

      if (!name) {
        throw new ConflictException(
          'Le nom de la section est obligatoire.',
        );
      }

      const existing =
        await this.prisma.section.findFirst({
          where: {
            farmId: currentUser.farmId,
            name,
            NOT: {
              id: input.id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Une autre section porte déjà ce nom.',
        );
      }
    }

    const updatedSection = await this.prisma.section.update({
      where: {
        id: section.id,
      },

      data: {
        name:
          input.name !== undefined
            ? input.name.trim()
            : undefined,

        type: input.type,

        description:
          input.description,
      },

      include: {
        _count: {
          select: {
            cages: true,
          },
        },
      },
    });

    return this.toSectionModel(updatedSection);
  }

  /**
   * Suppression d'une section.
   *
   * On interdit la suppression si des cages
   * sont encore rattachées à la section.
   */
  async remove(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const section =
      await this.prisma.section.findFirst({
        where: {
          id,
          farmId: currentUser.farmId,
        },

        include: {
          _count: {
            select: {
              cages: true,
            },
          },
        },
      });

    if (!section) {
      throw new NotFoundException(
        'Section introuvable.',
      );
    }

    if (section._count.cages > 0) {
      throw new ConflictException(
        'Impossible de supprimer une section contenant encore des cages.',
      );
    }

    const deletedSection = await this.prisma.section.delete({
      where: {
        id: section.id,
      },

      include: {
        _count: {
          select: {
            cages: true,
          },
        },
      },
    });

    return this.toSectionModel(deletedSection);
  }
}