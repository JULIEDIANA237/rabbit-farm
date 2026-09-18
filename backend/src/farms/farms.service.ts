import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmInput } from './dto/create-farm.input';
import { CurrentUserType } from '../auth/types/current-user.type';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateFarmInput) {
    return this.prisma.farm.create({
      data: {
        name: input.name,
        description: input.description,
        location: input.location,
      },
    });
  }

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

  async findOne(id: string, user: CurrentUserType) {
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