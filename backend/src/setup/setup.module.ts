import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { BreedingModule } from '../breeding/breeding.module.js';
import { RabbitsModule } from '../rabbits/rabbits.module.js';

import { SetupResolver } from './setup.resolver.js';
import { SetupService } from './setup.service.js';

@Module({
  imports: [AuthModule, RabbitsModule, BreedingModule],
  providers: [SetupService, SetupResolver],
  exports: [SetupService],
})
export class SetupModule {}
