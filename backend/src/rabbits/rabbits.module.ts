import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { RabbitsService } from './rabbits.service.js';
import { RabbitsResolver } from './rabbits.resolver.js';
import { TraceabilityService } from './traceability.service.js';

import { RabbitPhotosService } from './rabbit-photo.service.js';
import { RabbitPhotoController } from './rabbit-photo.controller.js';
import { StorageModule } from '../storage/storage.module.js';

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
    TraceabilityService,
    RabbitPhotosService,
  ],

  exports: [
    RabbitsService,
    RabbitPhotosService,
  ],
})
export class RabbitsModule {}