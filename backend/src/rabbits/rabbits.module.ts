import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { RabbitsService } from './rabbits.service';
import { RabbitsResolver } from './rabbits.resolver';

@Module({
  imports: [
    AuthModule,
  ],

  providers: [
    RabbitsService,
    RabbitsResolver,
  ],

  exports: [
    RabbitsService,
  ],
})
export class RabbitsModule {}