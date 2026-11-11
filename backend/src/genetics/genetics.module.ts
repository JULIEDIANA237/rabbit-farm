import { Module } from '@nestjs/common';

import { GeneticsService } from './genetics.service.js';
import { GeneticsResolver } from './genetics.resolver.js';
import { GenealogyService } from './genealogy.service.js';
import { GenealogyResolver } from './genealogy.resolver.js';

import { AuthModule } from '../auth/auth.module.js';

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
