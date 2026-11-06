import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OperationsResolver } from './operations.resolver';
import { OperationsService } from './operations.service';
import { TaskAutomationService } from './automation/task-automation.service';

@Module({
  imports: [AuthModule],
  providers: [OperationsService, OperationsResolver, TaskAutomationService],
  exports: [OperationsService, TaskAutomationService],
})
export class OperationsModule {}
