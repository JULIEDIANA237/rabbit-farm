import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { CagesService } from './cages.service';
import { CagesResolver } from './cages.resolver';

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