import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OperationsResolver } from './operations.resolver';
import { OperationsService } from './operations.service';

@Module({
  imports: [AuthModule],
  providers: [OperationsService, OperationsResolver],
})
export class OperationsModule {}
