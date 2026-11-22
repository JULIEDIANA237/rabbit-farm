import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { OperationsModule } from '../operations/operations.module.js';

import { AdvisorResolver } from './advisor.resolver.js';
import { AdvisorService } from './advisor.service.js';

@Module({
  imports: [AuthModule, OperationsModule],
  providers: [AdvisorService, AdvisorResolver],
})
export class AdvisorModule {}
