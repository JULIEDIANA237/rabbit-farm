import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { Throttle } from '../common/throttle/throttle.js';

import { AssistantService } from './assistant.service.js';

const MAX_BYTES = 4 * 1024 * 1024; // sous la limite de 4,5 Mo des fonctions Vercel
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

/** Photo d'une page de cahier : renvoie ce que l'IA a lu, sans rien enregistrer. */
@Controller('assistant')
@UseGuards(JwtAuthGuard)
export class NotebookController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('notebook')
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: MAX_BYTES } }))
  read(@UploadedFile() file: Express.Multer.File | undefined, @CurrentUser() user: CurrentUserType) {
    if (!file?.buffer?.length) throw new BadRequestException('Ajoute une photo du cahier.');
    if (!IMAGE_TYPES.includes(file.mimetype)) throw new BadRequestException('Format non pris en charge : envoie une photo (JPEG ou PNG).');
    return this.assistant.readNotebook(user, file.buffer, file.mimetype);
  }
}
