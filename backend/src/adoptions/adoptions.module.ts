import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { AdoptionsService } from './adoptions.service.js';
import { AdoptionsResolver } from './adoptions.resolver.js';

@Module({
  imports: [AuthModule],
  providers: [
    AdoptionsService,
    AdoptionsResolver,
  ],
})
export class AdoptionsModule {}