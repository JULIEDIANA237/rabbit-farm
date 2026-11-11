import { Logger, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { API_KEY_VARS, createModel, readAiConfig, type AiConfig } from './ai-config.js';
import { AssistantResolver } from './assistant.resolver.js';
import { ASSISTANT_CONFIG, ASSISTANT_FALLBACK_MODEL, ASSISTANT_MODEL, AssistantService } from './assistant.service.js';

@Module({
  imports: [AuthModule],
  providers: [
    { provide: ASSISTANT_CONFIG, useFactory: () => readAiConfig() },
    {
      provide: ASSISTANT_MODEL,
      useFactory: (config: AiConfig) => {
        const logger = new Logger('Assistant IA');
        if (config.enabled) {
          logger.log(
            `activé (${config.provider}, modèle ${config.model}${config.fallbackModel ? `, secours ${config.fallbackModel}` : ''})`,
          );
        } else {
          logger.warn(
            `désactivé : ${API_KEY_VARS[config.provider]} est absente du .env (fournisseur « ${config.provider} »). Ajoute-la puis redémarre le backend.`,
          );
        }
        return createModel(config);
      },
      inject: [ASSISTANT_CONFIG],
    },
    {
      provide: ASSISTANT_FALLBACK_MODEL,
      useFactory: (config: AiConfig) => createModel(config, process.env, config.fallbackModel),
      inject: [ASSISTANT_CONFIG],
    },
    AssistantService,
    AssistantResolver,
  ],
})
export class AssistantModule {}
