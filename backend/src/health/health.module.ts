import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { HealthResolver } from './health.resolver';
import { HealthService } from './health.service';

@Module({
  imports: [AuthModule],
  providers: [HealthService, HealthResolver],
})
export class HealthModule {}
