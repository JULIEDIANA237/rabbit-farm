import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { GeneticsModule } from '../genetics/genetics.module';

import { StatisticsService } from './statistics.service';
import { StatisticsResolver } from './statistics.resolver';

@Module({
  imports: [AuthModule, GeneticsModule],
  providers: [StatisticsService, StatisticsResolver],
})
export class StatisticsModule {}
