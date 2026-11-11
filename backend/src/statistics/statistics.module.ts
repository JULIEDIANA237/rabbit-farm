import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { GeneticsModule } from '../genetics/genetics.module.js';

import { StatisticsService } from './statistics.service.js';
import { StatisticsResolver } from './statistics.resolver.js';

@Module({
  imports: [AuthModule, GeneticsModule],
  providers: [StatisticsService, StatisticsResolver],
})
export class StatisticsModule {}
