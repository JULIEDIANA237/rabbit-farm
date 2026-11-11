import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { CagesService } from './cages.service.js';
import { CagesResolver } from './cages.resolver.js';

@Module({
  imports: [
    AuthModule,
  ],

  providers: [
    CagesService,
    CagesResolver,
  ],

  exports: [
    CagesService,
  ],
})
export class CagesModule {}