import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SalesResolver } from './sales.resolver';
import { SalesService } from './sales.service';

@Module({
  imports: [AuthModule],
  providers: [SalesService, SalesResolver],
})
export class SalesModule {}
