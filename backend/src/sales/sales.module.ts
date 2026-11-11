import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { SalesResolver } from './sales.resolver.js';
import { SalesService } from './sales.service.js';

@Module({
  imports: [AuthModule],
  providers: [SalesService, SalesResolver],
})
export class SalesModule {}
