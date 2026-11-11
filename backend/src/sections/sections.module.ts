import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { SectionsService } from './sections.service.js';
import { SectionsResolver } from './sections.resolver.js';

@Module({
  imports: [
    AuthModule,
  ],

  providers: [
    SectionsService,
    SectionsResolver,
  ],

  exports: [
    SectionsService,
  ],
})
export class SectionsModule {}