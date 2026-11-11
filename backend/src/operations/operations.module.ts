import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { OperationsResolver } from './operations.resolver.js';
import { OperationsService } from './operations.service.js';
import { TaskAutomationService } from './automation/task-automation.service.js';

@Module({
  imports: [AuthModule],
  providers: [OperationsService, OperationsResolver, TaskAutomationService],
  exports: [OperationsService, TaskAutomationService],
})
export class OperationsModule {}
