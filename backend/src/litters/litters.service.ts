import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';

import { CreateLitterInput } from './inputs/create-litter.input';

@Injectable()
export class LittersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    input: CreateLitterInput,
    currentUser: CurrentUserType,
  ) {
    const code = input.code.trim().toUpperCase();

    if (!code) {
      throw new BadRequestException(
        'Le code de la portée est obligatoire.',
      );
    }

    const birth = await this.prisma.birth.findFirst({
      where: {
        id: input.birthId,
        farmId: currentUser.farmId,
      },
      include: {
        litter: true,
        breeding: {
          include: {
            female: true,
            male: true,
          },
        },
      },
    });

    if (!birth) {
      throw new NotFoundException(
        'Naissance introuvable.',
      );
    }

    if (birth.litter) {
      throw new ConflictException(
        'Une portée existe déjà pour cette naissance.',
      );
    }

    const existing = await this.prisma.litter.findFirst({
      where: {
        farmId: currentUser.farmId,
        code,
      },
    });

    if (existing) {
      throw new ConflictException(
        `La portée ${code} existe déjà.`,
      );
    }

    return this.prisma.litter.create({
      data: {
        farmId: currentUser.farmId,
        birthId: input.birthId,
        code,
        motherId: birth.motherId,
        birthDate: birth.birthDate,
        liveBorn: birth.liveBorn,
        stillBorn: birth.stillBorn,
        currentCount: birth.liveBorn,
        observation: input.observation?.trim() || null,
      },
    });
  }

  async findAll(
    currentUser: CurrentUserType,
  ) {
    return this.prisma.litter.findMany({
      where: {
        farmId: currentUser.farmId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    const litter = await this.prisma.litter.findFirst({
      where: {
        id,
        farmId: currentUser.farmId,
      },
    });

    if (!litter) {
      throw new NotFoundException(
        'Portée introuvable.',
      );
    }

    return litter;
  }

  async findByBirth(
    birthId: string,
    currentUser: CurrentUserType,
  ) {
    const birth = await this.prisma.birth.findFirst({
      where: {
        id: birthId,
        farmId: currentUser.farmId,
      },
    });

    if (!birth) {
      throw new NotFoundException(
        'Naissance introuvable.',
      );
    }

    return this.prisma.litter.findFirst({
      where: {
        birthId,
        farmId: currentUser.farmId,
      },
    });
  }
}