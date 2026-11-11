import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { OperationsModule } from '../operations/operations.module.js';
import { HealthResolver } from './health.resolver.js';
import { HealthService } from './health.service.js';

@Module({
  imports: [AuthModule, OperationsModule,],
  providers: [HealthService, HealthResolver],
})
export class HealthModule {}
