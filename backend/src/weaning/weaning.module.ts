import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { OperationsModule } from '../operations/operations.module.js';
import { WeaningResolver } from './weaning.resolver.js';
import { WeaningService } from './weaning.service.js';

@Module({
	imports: [AuthModule, OperationsModule,],
	providers: [WeaningService, WeaningResolver],
})
export class WeaningModule {}
