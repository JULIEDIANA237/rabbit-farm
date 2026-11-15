import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { SalesResolver } from './sales.resolver.js';
import { SalesService } from './sales.service.js';
import { SaleReadinessResolver } from './readiness/sale-readiness.resolver.js';
import { SaleReadinessService } from './readiness/sale-readiness.service.js';

@Module({
  imports: [AuthModule],
  providers: [SalesService, SalesResolver, SaleReadinessService, SaleReadinessResolver],
  exports: [SaleReadinessService],
})
export class SalesModule {}
