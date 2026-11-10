import { Logger, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { API_KEY_VARS, createModel, readAiConfig, type AiConfig } from './ai-config';
import { AssistantResolver } from './assistant.resolver';
import { ASSISTANT_CONFIG, ASSISTANT_MODEL, AssistantService } from './assistant.service';

@Module({
  imports: [AuthModule],
  providers: [
    { provide: ASSISTANT_CONFIG, useFactory: () => readAiConfig() },
    {
      provide: ASSISTANT_MODEL,
      useFactory: (config: AiConfig) => {
        const logger = new Logger('Assistant IA');
        if (config.enabled) {
          logger.log(`activé (${config.provider}, modèle ${config.model})`);
        } else {
          logger.warn(
            `désactivé : ${API_KEY_VARS[config.provider]} est absente du .env (fournisseur « ${config.provider} »). Ajoute-la puis redémarre le backend.`,
          );
        }
        return createModel(config);
      },
      inject: [ASSISTANT_CONFIG],
    },
    AssistantService,
    AssistantResolver,
  ],
})
export class AssistantModule {}
