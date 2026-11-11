import { Module } from '@nestjs/common';

import { BreedingService } from './breeding.service.js';
import { BreedingResolver } from './breeding.resolver.js';

import { AuthModule } from '../auth/auth.module.js';
import { GeneticsModule } from '../genetics/genetics.module.js';
import { OperationsModule } from '../operations/operations.module.js';

@Module({
  imports: [AuthModule, GeneticsModule, OperationsModule],
  providers: [BreedingService, BreedingResolver],
  exports: [BreedingService],
})
export class BreedingModule {}
