import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

/**
 * Choix du fournisseur d'IA par variables d'environnement :
 *
 *   AI_PROVIDER=google      (défaut) + GOOGLE_GENERATIVE_AI_API_KEY
 *   AI_PROVIDER=anthropic   + ANTHROPIC_API_KEY
 *   AI_MODEL=<identifiant>  (optionnel, sinon le modèle par défaut)
 *
 * Sans clé, l'assistant est simplement désactivé : le reste de l'app
 * fonctionne normalement.
 */

export type AiProvider = 'google' | 'anthropic';

export interface AiConfig {
  enabled: boolean;
  provider: AiProvider;
  model: string;
  dailyLimit: number;
}

export const DEFAULT_MODELS: Record<AiProvider, string> = {
  google: 'gemini-flash-latest',
  anthropic: 'claude-haiku-5-5',
};

const API_KEY_VARS: Record<AiProvider, string> = {
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
};

export function readAiConfig(env: NodeJS.ProcessEnv = process.env): AiConfig {
  const provider: AiProvider =
    env.AI_PROVIDER?.toLowerCase() === 'anthropic' ? 'anthropic' : 'google';
  const limit = Number.parseInt(env.AI_DAILY_LIMIT ?? '', 10);

  return {
    enabled: Boolean(env[API_KEY_VARS[provider]]),
    provider,
    model: env.AI_MODEL?.trim() || DEFAULT_MODELS[provider],
    dailyLimit: Number.isFinite(limit) && limit > 0 ? limit : 150,
  };
}

export function createModel(
  config: AiConfig,
  env: NodeJS.ProcessEnv = process.env,
): LanguageModel | null {
  if (!config.enabled) return null;

  if (config.provider === 'anthropic') {
    return createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })(config.model);
  }

  return createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  })(config.model);
}
