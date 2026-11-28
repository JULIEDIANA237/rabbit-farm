import { TrackingSheetService } from './tracking/tracking-sheet.service.js';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { FatteningService } from './fattening.service.js';
import { FatteningResolver } from './fattening.resolver.js';

@Module({
  imports: [AuthModule],
  providers: [FatteningService, FatteningResolver, TrackingSheetService],
  exports: [FatteningService],
})
export class FatteningModule {}
