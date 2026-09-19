import { Module } from '@nestjs/common';

import { BirthsService } from './births.service';
import { BirthsResolver } from './births.resolver';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [
    BirthsService,
    BirthsResolver,
  ],
  exports: [
    BirthsService,
  ],
})
export class BirthsModule {}