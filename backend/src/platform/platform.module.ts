import { Global, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { PlatformResolver } from './platform.resolver.js';
import { PlatformService } from './platform.service.js';

@Global()
@Module({
  imports: [AuthModule],
  providers: [PlatformService, PlatformResolver],
  exports: [PlatformService],
})
export class PlatformModule {}
