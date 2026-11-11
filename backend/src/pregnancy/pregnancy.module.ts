import { Module } from '@nestjs/common';

import { PregnancyService } from './pregnancy.service.js';
import { PregnancyResolver } from './pregnancy.resolver.js';

import { AuthModule } from '../auth/auth.module.js';
import { OperationsModule } from '../operations/operations.module.js';

@Module({
  imports: [
    AuthModule, OperationsModule,
  ],
  providers: [
    PregnancyService,
    PregnancyResolver,
  ],
  exports: [
    PregnancyService,
  ],
})
export class PregnancyModule {}