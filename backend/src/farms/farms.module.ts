import { Module } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { FarmsResolver } from './farms.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FarmsService, FarmsResolver],
  exports: [FarmsService],
})
export class FarmsModule {}