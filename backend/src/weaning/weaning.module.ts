import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { WeaningResolver } from './weaning.resolver';
import { WeaningService } from './weaning.service';

@Module({
	imports: [AuthModule],
	providers: [WeaningService, WeaningResolver],
})
export class WeaningModule {}
