import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { CareResolver } from './care.resolver.js';
import { CareService } from './care.service.js';

@Module({
  imports: [AuthModule],
  providers: [CareService, CareResolver],
})
export class CareModule {}
