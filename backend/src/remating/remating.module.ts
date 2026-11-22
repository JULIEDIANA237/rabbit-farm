import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { RematingResolver } from './remating.resolver.js';
import { RematingService } from './remating.service.js';

@Module({
  imports: [AuthModule],
  providers: [RematingService, RematingResolver],
})
export class RematingModule {}
