import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { AdoptionsService } from './adoptions.service';
import { AdoptionsResolver } from './adoptions.resolver';

@Module({
  imports: [AuthModule],
  providers: [
    AdoptionsService,
    AdoptionsResolver,
  ],
})
export class AdoptionsModule {}