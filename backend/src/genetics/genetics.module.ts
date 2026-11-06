import { Module } from '@nestjs/common';

import { GeneticsService } from './genetics.service';
import { GeneticsResolver } from './genetics.resolver';
import { GenealogyService } from './genealogy.service';
import { GenealogyResolver } from './genealogy.resolver';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [
    GeneticsService,
    GeneticsResolver,
    GenealogyService,
    GenealogyResolver,
  ],
  exports: [GeneticsService, GenealogyService],
})
export class GeneticsModule {}
