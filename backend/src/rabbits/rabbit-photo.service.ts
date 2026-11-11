import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { SupabaseStorageService } from '../storage/supabase-storage.service.js';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

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

    const uploaded =
      await this.storage.uploadRabbitPhoto(
        file,
        farmId,
        rabbitId,
      );

    /*
     * Une fois l'envoi réussi seulement : si la photo devient principale,
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

    const deleted = await this.prisma.rabbitPhoto.delete({
      where: {
        id: photo.id,
      },
    });

    // La photo principale supprimée est remplacée par la plus récente.
    if (photo.isPrimary) {
      const next = await this.prisma.rabbitPhoto.findFirst({
        where: { rabbitId: photo.rabbitId },
        orderBy: { createdAt: 'desc' },
      });
      if (next) {
        await this.prisma.rabbitPhoto.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    return deleted;
  }

  async setPrimary(
    photoId: string,
    currentUser: CurrentUserType,
  ) {
    const photo =
      await this.prisma.rabbitPhoto.findFirst({
        where: {
          id: photoId,
          rabbit: {
            farmId: currentUser.farmId,
          },
        },
      });

    if (!photo) {
      throw new NotFoundException(
        'Photo introuvable.',
      );
    }

    const [, updated] = await this.prisma.$transaction([
      this.prisma.rabbitPhoto.updateMany({
        where: { rabbitId: photo.rabbitId, isPrimary: true },
        data: { isPrimary: false },
      }),
      this.prisma.rabbitPhoto.update({
        where: { id: photo.id },
        data: { isPrimary: true },
      }),
    ]);

    return updated;
  }
}