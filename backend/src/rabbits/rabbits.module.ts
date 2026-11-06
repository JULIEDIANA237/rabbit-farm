import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { RabbitsService } from './rabbits.service';
import { RabbitsResolver } from './rabbits.resolver';
import { TraceabilityService } from './traceability.service';

@Module({
  imports: [
    AuthModule,
  ],

  providers: [
    RabbitsService,
    RabbitsResolver,
    TraceabilityService,
  ],

  exports: [
    RabbitsService,
  ],
})
export class RabbitsModule {}