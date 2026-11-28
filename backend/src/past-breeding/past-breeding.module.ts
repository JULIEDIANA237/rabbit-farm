import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { BirthsModule } from '../births/births.module.js';
import { BreedingModule } from '../breeding/breeding.module.js';
import { FatteningModule } from '../fattening/fattening.module.js';
import { MortalityModule } from '../mortality/mortality.module.js';
import { OperationsModule } from '../operations/operations.module.js';
import { PregnancyModule } from '../pregnancy/pregnancy.module.js';
import { WeaningModule } from '../weaning/weaning.module.js';
import { PastBreedingResolver } from './past-breeding.resolver.js';
import { PastBreedingService } from './past-breeding.service.js';

@Module({
  imports: [AuthModule, BreedingModule, PregnancyModule, BirthsModule, WeaningModule, MortalityModule, FatteningModule, OperationsModule],
  providers: [PastBreedingService, PastBreedingResolver],
})
export class PastBreedingModule {}
