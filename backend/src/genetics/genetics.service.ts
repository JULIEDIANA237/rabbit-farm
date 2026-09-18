import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';

import { CreateBreedInput } from './inputs/create-breed.input';
import { UpdateBreedInput } from './inputs/update-breed.input';
import { CreateCrossBreedInput } from './inputs/create-cross-breed.input';
import { UpdateCrossBreedInput } from './inputs/update-cross-breed.input';

@Injectable()
export class GeneticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------
  // BREEDS
  // ----------------------------------------------------

  async findAllBreeds(currentUser: CurrentUserType) {
    return this.prisma.breed.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findBreedById(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const breed = await this.prisma.breed.findFirst({
      where: {
        id,
        farmId: currentUser.farmId,
      },
    });

    if (!breed) {
      throw new NotFoundException('Race introuvable.');
    }

    return breed;
  }

  async createBreed(
    input: CreateBreedInput,
    currentUser: CurrentUserType,
  ) {
    const name = input.name.trim();

    if (!name) {
      throw new BadRequestException(
        'Le nom de la race est obligatoire.',
      );
    }

    const existingBreed = await this.prisma.breed.findFirst({
      where: {
        farmId: currentUser.farmId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingBreed) {
      throw new BadRequestException(
        'Cette race existe déjà dans cette ferme.',
      );
    }

    return this.prisma.breed.create({
      data: {
        farmId: currentUser.farmId,
        name,
        description: input.description?.trim() || null,
      },
    });
  }

  async updateBreed(
    input: UpdateBreedInput,
    currentUser: CurrentUserType,
  ) {
    const breed = await this.findBreedById(
      input.id,
      currentUser,
    );

    const name = input.name?.trim();

    if (name && name !== breed.name) {
      const existingBreed = await this.prisma.breed.findFirst({
        where: {
          farmId: currentUser.farmId,
          name: {
            equals: name,
            mode: 'insensitive',
          },
          NOT: {
            id: breed.id,
          },
        },
      });

      if (existingBreed) {
        throw new BadRequestException(
          'Une autre race porte déjà ce nom.',
        );
      }
    }

    return this.prisma.breed.update({
      where: {
        id: breed.id,
      },
      data: {
        name: name || undefined,
        description:
          input.description === undefined
            ? undefined
            : input.description.trim() || null,
      },
    });
  }

  async deleteBreed(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const breed = await this.findBreedById(id, currentUser);

    const rabbitsUsingBreed = await this.prisma.rabbit.count({
      where: {
        farmId: currentUser.farmId,
        breedId: breed.id,
      },
    });

    const crossBreedsUsingBreed =
      await this.prisma.crossBreed.count({
        where: {
          farmId: currentUser.farmId,
          OR: [
            { parentBreedAId: breed.id },
            { parentBreedBId: breed.id },
          ],
        },
      });

    if (rabbitsUsingBreed > 0 || crossBreedsUsingBreed > 0) {
      throw new BadRequestException(
        'Cette race est utilisée par des lapins ou des croisements. ' +
          'Elle ne peut pas être supprimée.',
      );
    }

    await this.prisma.breed.delete({
      where: {
        id: breed.id,
      },
    });

    return true;
  }

  // ----------------------------------------------------
  // CROSS-BREEDS
  // ----------------------------------------------------

  async findAllCrossBreeds(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.crossBreed.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      include: {
        parentBreedA: true,
        parentBreedB: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findCrossBreedById(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const crossBreed = await this.prisma.crossBreed.findFirst({
      where: {
        id,
        farmId: currentUser.farmId,
      },
      include: {
        parentBreedA: true,
        parentBreedB: true,
      },
    });

    if (!crossBreed) {
      throw new NotFoundException('Croisement introuvable.');
    }

    return crossBreed;
  }

  private async validateParentBreeds(
    parentBreedAId: string,
    parentBreedBId: string,
    currentUser: CurrentUserType,
  ) {
    if (parentBreedAId === parentBreedBId) {
      throw new BadRequestException(
        'Les deux races parentes doivent être différentes.',
      );
    }

    const breeds = await this.prisma.breed.findMany({
      where: {
        farmId: currentUser.farmId,
        id: {
          in: [parentBreedAId, parentBreedBId],
        },
      },
    });

    if (breeds.length !== 2) {
      throw new BadRequestException(
        'Une ou plusieurs races parentes sont invalides.',
      );
    }
  }

  async createCrossBreed(
    input: CreateCrossBreedInput,
    currentUser: CurrentUserType,
  ) {
    const name = input.name.trim();

    if (!name) {
      throw new BadRequestException(
        'Le nom du croisement est obligatoire.',
      );
    }

    await this.validateParentBreeds(
      input.parentBreedAId,
      input.parentBreedBId,
      currentUser,
    );

    const existingCrossBreed =
      await this.prisma.crossBreed.findFirst({
        where: {
          farmId: currentUser.farmId,
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

    if (existingCrossBreed) {
      throw new BadRequestException(
        'Ce croisement existe déjà dans cette ferme.',
      );
    }

    return this.prisma.crossBreed.create({
      data: {
        farmId: currentUser.farmId,
        name,
        parentBreedAId: input.parentBreedAId,
        parentBreedBId: input.parentBreedBId,
        description: input.description?.trim() || null,
      },
      include: {
        parentBreedA: true,
        parentBreedB: true,
      },
    });
  }

  async updateCrossBreed(
    input: UpdateCrossBreedInput,
    currentUser: CurrentUserType,
  ) {
    const existing = await this.findCrossBreedById(
      input.id,
      currentUser,
    );

    const parentBreedAId =
      input.parentBreedAId ?? existing.parentBreedAId;

    const parentBreedBId =
      input.parentBreedBId ?? existing.parentBreedBId;

    await this.validateParentBreeds(
      parentBreedAId,
      parentBreedBId,
      currentUser,
    );

    const name = input.name?.trim();

    if (name && name !== existing.name) {
      const duplicate =
        await this.prisma.crossBreed.findFirst({
          where: {
            farmId: currentUser.farmId,
            name: {
              equals: name,
              mode: 'insensitive',
            },
            NOT: {
              id: existing.id,
            },
          },
        });

      if (duplicate) {
        throw new BadRequestException(
          'Un autre croisement porte déjà ce nom.',
        );
      }
    }

    return this.prisma.crossBreed.update({
      where: {
        id: existing.id,
      },
      data: {
        name: name || undefined,
        parentBreedAId,
        parentBreedBId,
        description:
          input.description === undefined
            ? undefined
            : input.description.trim() || null,
      },
      include: {
        parentBreedA: true,
        parentBreedB: true,
      },
    });
  }

  async deleteCrossBreed(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const crossBreed = await this.findCrossBreedById(
      id,
      currentUser,
    );

    const rabbitsUsingCrossBreed =
      await this.prisma.rabbit.count({
        where: {
          farmId: currentUser.farmId,
          crossBreedId: crossBreed.id,
        },
      });

    if (rabbitsUsingCrossBreed > 0) {
      throw new BadRequestException(
        'Ce croisement est utilisé par des lapins et ne peut pas être supprimé.',
      );
    }

    await this.prisma.crossBreed.delete({
      where: {
        id: crossBreed.id,
      },
    });

    return true;
  }
}