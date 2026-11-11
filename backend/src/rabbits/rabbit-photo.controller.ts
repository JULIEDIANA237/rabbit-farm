import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { RabbitPhotosService } from './rabbit-photo.service.js';

@Controller('rabbits')
@UseGuards(JwtAuthGuard)
export class RabbitPhotoController {
  constructor(
    private readonly photoService: RabbitPhotosService,
  ) {}

  @Post(':rabbitId/photos')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadPhoto(
    @Param('rabbitId') rabbitId: string,

    @UploadedFile() file: Express.Multer.File,

    @CurrentUser()
    currentUser: CurrentUserType,

    /** « false » pour ajouter la photo à la galerie sans changer la principale. */
    @Body('isPrimary') isPrimary?: string,
  ) {
    return this.photoService.upload(
      rabbitId,
      file,
      currentUser,
      isPrimary !== 'false',
    );
  }

  @Patch('photos/:photoId/primary')
  async setPrimary(
    @Param('photoId') photoId: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.photoService.setPrimary(
      photoId,
      currentUser,
    );
  }

  @Delete('photos/:photoId')
  async deletePhoto(
    @Param('photoId') photoId: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.photoService.delete(
      photoId,
      currentUser,
    );
  }
}