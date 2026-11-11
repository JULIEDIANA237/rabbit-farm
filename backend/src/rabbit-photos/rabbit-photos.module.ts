import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { RabbitPhotosController } from './rabbit-photos.controller.js';
import { RabbitPhotosService } from './rabbit-photos.service.js';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    RabbitPhotosController,
  ],

  providers: [
    RabbitPhotosService,
  ],

  exports: [
    RabbitPhotosService,
  ],
})
export class RabbitPhotosModule {}