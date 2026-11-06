import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { SupabaseStorageService } from '../storage/supabase-storage.service';

import type { CurrentUserType } from '../auth/types/current-user.type';

@Injectable()
export class RabbitPhotosService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly storage:
      SupabaseStorageService,
  ) {}

  async upload(
    rabbitId: string,
    file: Express.Multer.File,
    currentUser: CurrentUserType,
    isPrimary = true,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Aucune photo reçue.',
      );
    }

    if (
      !file.mimetype.startsWith('image/')
    ) {
      throw new BadRequestException(
        'Le fichier doit être une image.',
      );
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException(
        'La photo ne doit pas dépasser 5 Mo.',
      );
    }

    const farmId =
      currentUser.farmId;

    if (!farmId) {
      throw new BadRequestException(
        'Aucune ferme associée à cet utilisateur.',
      );
    }

    const rabbit =
      await this.prisma.rabbit.findFirst({
        where: {
          id: rabbitId,
          farmId,
        },
      });

    if (!rabbit) {
      throw new NotFoundException(
        'Lapin introuvable.',
      );
    }

    /*
     * Si la photo devient principale,
     * on retire ce statut aux autres photos.
     */
    if (isPrimary) {
      await this.prisma.rabbitPhoto.updateMany({
        where: {
          rabbitId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const uploaded =
      await this.storage.uploadRabbitPhoto(
        file,
        farmId,
        rabbitId,
      );

    const photo =
      await this.prisma.rabbitPhoto.create({
        data: {
          rabbitId,
          url: uploaded.url,
          path: uploaded.path,
          isPrimary,
        },
      });

    return photo;
  }

  async findAll(
    rabbitId: string,
    currentUser: CurrentUserType,
  ) {
    const farmId =
      currentUser.farmId;

    const rabbit =
      await this.prisma.rabbit.findFirst({
        where: {
          id: rabbitId,
          farmId,
        },
        select: {
          id: true,
        },
      });

    if (!rabbit) {
      throw new NotFoundException(
        'Lapin introuvable.',
      );
    }

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

  async delete(
    photoId: string,
    currentUser: CurrentUserType,
  ) {
    const farmId = currentUser.farmId;

    if (!farmId) {
      throw new BadRequestException(
        'Aucune ferme associée à cet utilisateur.',
      );
    }

    const photo =
      await this.prisma.rabbitPhoto.findFirst({
        where: {
          id: photoId,
          rabbit: {
            farmId,
          },
        },
      });

    if (!photo) {
      throw new NotFoundException(
        'Photo introuvable.',
      );
    }

    await this.storage.deleteFile(photo.path);

    return this.prisma.rabbitPhoto.delete({
      where: {
        id: photo.id,
      },
    });
  }
}