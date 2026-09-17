import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmInput } from './dto/create-farm.input';

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

  async findAll() {
    return this.prisma.farm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.farm.findUnique({
      where: { id },
    });
  }
}