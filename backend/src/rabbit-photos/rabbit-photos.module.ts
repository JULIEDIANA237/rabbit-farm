import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { RabbitPhotosController } from './rabbit-photos.controller';
import { RabbitPhotosService } from './rabbit-photos.service';

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