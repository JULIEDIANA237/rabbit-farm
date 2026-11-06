import { Module } from '@nestjs/common';

import { BreedingService } from './breeding.service';
import { BreedingResolver } from './breeding.resolver';

import { AuthModule } from '../auth/auth.module';
import { GeneticsModule } from '../genetics/genetics.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [AuthModule, GeneticsModule, OperationsModule],
  providers: [BreedingService, BreedingResolver],
  exports: [BreedingService],
})
export class BreedingModule {}
