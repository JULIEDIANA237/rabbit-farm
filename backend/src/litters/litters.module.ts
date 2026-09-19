import { Module } from '@nestjs/common';

import { LittersService } from './litters.service';
import { LittersResolver } from './litters.resolver';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [
    LittersService,
    LittersResolver,
  ],
  exports: [
    LittersService,
  ],
})
export class LittersModule {}