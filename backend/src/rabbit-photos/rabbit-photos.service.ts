import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RabbitPhotosService {
  private readonly uploadDirectory = join(
    process.cwd(),
    'uploads',
    'rabbits',
  );

  constructor(
    private readonly prisma: PrismaService,
  ) {
    if (!existsSync(this.uploadDirectory)) {
      mkdirSync(this.uploadDirectory, {
        recursive: true,
      });
    }
  }

  async addPhoto(
    rabbitId: string,
    file: Express.Multer.File,
    isPrimary = false,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Aucune photo reçue.',
      );
    }

    const rabbit = await this.prisma.rabbit.findUnique({
      where: {
        id: rabbitId,
      },
    });

    if (!rabbit) {
      throw new NotFoundException(
        'Lapin introuvable.',
      );
    }

    if (isPrimary) {
      await this.prisma.rabbitPhoto.updateMany({
        where: {
          rabbitId,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const photoUrl =
      `/uploads/rabbits/${file.filename}`;

    return this.prisma.rabbitPhoto.create({
      data: {
        rabbitId,
        url: photoUrl,
        filename: file.originalname,
        mimeType: file.mimetype,
        isPrimary,
      },
    });
  }

  async getPhotos(rabbitId: string) {
    return this.prisma.rabbitPhoto.findMany({
      where: {
        rabbitId,
      },
      orderBy: [
        {
          isPrimary: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async setPrimary(
    rabbitId: string,
    photoId: string,
  ) {
    const photo =
      await this.prisma.rabbitPhoto.findFirst({
        where: {
          id: photoId,
          rabbitId,
        },
      });

    if (!photo) {
      throw new NotFoundException(
        'Photo introuvable.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.rabbitPhoto.updateMany({
        where: {
          rabbitId,
        },
        data: {
          isPrimary: false,
        },
      }),

      this.prisma.rabbitPhoto.update({
        where: {
          id: photoId,
        },
        data: {
          isPrimary: true,
        },
      }),
    ]);

    return this.prisma.rabbitPhoto.findUnique({
      where: {
        id: photoId,
      },
    });
  }

  async deletePhoto(
    rabbitId: string,
    photoId: string,
  ) {
    const photo =
      await this.prisma.rabbitPhoto.findFirst({
        where: {
          id: photoId,
          rabbitId,
        },
      });

    if (!photo) {
      throw new NotFoundException(
        'Photo introuvable.',
      );
    }

    return this.prisma.rabbitPhoto.delete({
      where: {
        id: photoId,
      },
    });
  }
}