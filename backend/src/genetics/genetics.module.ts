import { Module } from '@nestjs/common';

import { GeneticsService } from './genetics.service';
import { GeneticsResolver } from './genetics.resolver';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [GeneticsService, GeneticsResolver],
  exports: [GeneticsService],
})
export class GeneticsModule {}