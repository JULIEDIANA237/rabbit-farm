import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  ParseBoolPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  diskStorage,
} from 'multer';

import { extname } from 'path';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RabbitPhotosService } from './rabbit-photos.service';

@Controller('rabbits')
@UseGuards(JwtAuthGuard)
export class RabbitPhotosController {
  constructor(
    private readonly rabbitPhotosService: RabbitPhotosService,
  ) {}

  @Post(':rabbitId/photos')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/rabbits',

        filename: (
          _request,
          file,
          callback,
        ) => {
          const uniqueSuffix =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}`;

          callback(
            null,
            `${uniqueSuffix}${extname(
              file.originalname,
            )}`,
          );
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (
        _request,
        file,
        callback,
      ) => {
        if (
          !file.mimetype.startsWith(
            'image/',
          )
        ) {
          return callback(
            new BadRequestException(
              'Le fichier doit être une image.',
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
  ) {
    return this.rabbitPhotosService.addPhoto(
      rabbitId,
      file,
    );
  }

  @Delete(':rabbitId/photos/:photoId')
  async deletePhoto(
    @Param('rabbitId')
    rabbitId: string,

    @Param('photoId')
    photoId: string,
  ) {
    return this.rabbitPhotosService.deletePhoto(
      rabbitId,
      photoId,
    );
  }
}