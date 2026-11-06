import { Module } from '@nestjs/common';

import { PregnancyService } from './pregnancy.service';
import { PregnancyResolver } from './pregnancy.resolver';

import { AuthModule } from '../auth/auth.module';
import { OperationsModule } from '../operations/operations.module';

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