import { Module } from '@nestjs/common';

import { LittersService } from './litters.service.js';
import { LittersResolver } from './litters.resolver.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [
    LittersService,
    LittersResolver,
  ],
  exports: [
    LittersService,
  ],
})
export class LittersModule {}