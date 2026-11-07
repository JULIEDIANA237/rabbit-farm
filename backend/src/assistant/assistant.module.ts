import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { createModel, readAiConfig, type AiConfig } from './ai-config';
import { AssistantResolver } from './assistant.resolver';
import { ASSISTANT_CONFIG, ASSISTANT_MODEL, AssistantService } from './assistant.service';

@Module({
  imports: [AuthModule],
  providers: [
    { provide: ASSISTANT_CONFIG, useFactory: () => readAiConfig() },
    {
      provide: ASSISTANT_MODEL,
      useFactory: (config: AiConfig) => createModel(config),
      inject: [ASSISTANT_CONFIG],
    },
    AssistantService,
    AssistantResolver,
  ],
})
export class AssistantModule {}
