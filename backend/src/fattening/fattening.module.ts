import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FatteningService } from './fattening.service';
import { FatteningResolver } from './fattening.resolver';

@Module({
  imports: [AuthModule],
  providers: [FatteningService, FatteningResolver],
})
export class FatteningModule {}
