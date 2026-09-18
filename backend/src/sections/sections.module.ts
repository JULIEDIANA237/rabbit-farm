import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';

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