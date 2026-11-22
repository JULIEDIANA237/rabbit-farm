import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { createModel, readAiConfig, type AiConfig } from '../assistant/ai-config.js';

import { AgentCronController } from './agent-cron.controller.js';
import { AgentResolver } from './agent.resolver.js';
import { AGENT_CONFIG, AGENT_FALLBACK_MODEL, AGENT_MODEL, AgentService } from './agent.service.js';
import { ErrorRecorderInterceptor } from './error-recorder.interceptor.js';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [AgentCronController],
  providers: [
    { provide: AGENT_CONFIG, useFactory: () => readAiConfig() },
    { provide: AGENT_MODEL, useFactory: (config: AiConfig) => createModel(config), inject: [AGENT_CONFIG] },
    {
      provide: AGENT_FALLBACK_MODEL,
      useFactory: (config: AiConfig) => createModel(config, process.env, config.fallbackModel),
      inject: [AGENT_CONFIG],
    },
    AgentService,
    AgentResolver,
    { provide: APP_INTERCEPTOR, useClass: ErrorRecorderInterceptor },
  ],
})
export class AgentModule {}
