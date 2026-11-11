import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { MortalityService } from './mortality.service.js';
import { MortalityResolver } from './mortality.resolver.js';

@Module({
  imports: [AuthModule],
  providers: [MortalityService, MortalityResolver],
  exports: [MortalityService],
})
export class MortalityModule {}
