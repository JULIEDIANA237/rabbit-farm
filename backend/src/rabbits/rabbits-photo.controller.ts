import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { RabbitPhotosService } from './rabbit-photo.service.js';

@Controller('rabbits')
@UseGuards(JwtAuthGuard)
export class RabbitPhotosController {
  constructor(
    private readonly photosService:
      RabbitPhotosService,
  ) {}

  @Post(':rabbitId/photos')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),

      limits: {
        fileSize:
          5 * 1024 * 1024,
      },

      fileFilter: (
        _req,
        file,
        callback,
      ) => {
        if (
          !file.mimetype.startsWith(
            'image/',
          )
        ) {
          return callback(
            new Error(
              'Only image files are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadPhoto(
    @Param('rabbitId')
    rabbitId: string,

    @UploadedFile()
    file: Express.Multer.File,

    @CurrentUser()
    currentUser: CurrentUserType,

    @Body('isPrimary')
    isPrimary?: string,
  ) {
    return this.photosService.upload(
      rabbitId,
      file,
      currentUser,
      isPrimary !== 'false',
    );
  }
}