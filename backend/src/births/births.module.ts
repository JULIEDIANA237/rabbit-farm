import { Module } from '@nestjs/common';

import { BirthsService } from './births.service.js';
import { BirthsResolver } from './births.resolver.js';

import { AuthModule } from '../auth/auth.module.js';
import { OperationsModule } from '../operations/operations.module.js';

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