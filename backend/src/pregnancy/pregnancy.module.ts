import { Module } from '@nestjs/common';

import { PregnancyService } from './pregnancy.service';
import { PregnancyResolver } from './pregnancy.resolver';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
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