import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { RabbitsService } from './rabbits.service';
import { RabbitsResolver } from './rabbits.resolver';

import { RabbitPhotosService } from './rabbit-photo.service';
import { RabbitPhotoController } from './rabbit-photo.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    AuthModule,
    StorageModule,
  ],

  controllers: [
    RabbitPhotoController,
  ],

  providers: [
    RabbitsService,
    RabbitsResolver,
    RabbitPhotosService,
  ],

  exports: [
    RabbitsService,
    RabbitPhotosService,
  ],
})
export class RabbitsModule {}