import { Module } from '@nestjs/common';

import { BirthsService } from './births.service';
import { BirthsResolver } from './births.resolver';

import { AuthModule } from '../auth/auth.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [
    AuthModule, OperationsModule,
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