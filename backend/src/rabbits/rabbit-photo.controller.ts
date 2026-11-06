import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';

import { RabbitPhotosService } from './rabbit-photo.service';

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
  ) {
    return this.photoService.upload(
      rabbitId,
      file,
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