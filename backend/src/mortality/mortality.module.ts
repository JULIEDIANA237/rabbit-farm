import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MortalityService } from './mortality.service';
import { MortalityResolver } from './mortality.resolver';

@Module({
  imports: [AuthModule],
  providers: [MortalityService, MortalityResolver],
  exports: [MortalityService],
})
export class MortalityModule {}
