import { Module } from '@nestjs/common';
import { FarmsService } from './farms.service.js';
import { FarmsResolver } from './farms.resolver.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [FarmsService, FarmsResolver],
  exports: [FarmsService],
})
export class FarmsModule {}