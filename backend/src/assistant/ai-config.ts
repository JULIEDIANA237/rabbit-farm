import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';
import type { SharedV4ProviderOptions } from '@ai-sdk/provider';

/**
 * Choix du fournisseur d'IA par variables d'environnement :
 *
 *   AI_PROVIDER=google      (défaut) + GOOGLE_GENERATIVE_AI_API_KEY
 *   AI_PROVIDER=anthropic   + ANTHROPIC_API_KEY
 *   AI_MODEL=<identifiant>  (optionnel, sinon le modèle par défaut)
 *   AI_FALLBACK_MODEL=<id>  (optionnel : modèle de secours si le premier est saturé,
 *                            « none » pour désactiver)
 *   AI_TIMEOUT_MS=45000     (optionnel, délai maximum d'une réponse)
 *   AI_THINKING=low         (optionnel, Gemini : minimal | low | medium | high ;
 *                            plus bas = réponses plus rapides. Défaut : low)
 *
 * Sans clé, l'assistant est simplement désactivé : le reste de l'app
 * fonctionne normalement.
 */

export type AiProvider = 'google' | 'anthropic';

export interface AiConfig {
  enabled: boolean;
  provider: AiProvider;
  model: string;
  /** Modèle essayé quand le premier est saturé (null = aucun). */
  fallbackModel: string | null;
  dailyLimit: number;
  timeoutMs: number;
  /** Niveau de réflexion Gemini (moins = plus rapide). */
  thinking: 'minimal' | 'low' | 'medium' | 'high';
}

export const DEFAULT_MODELS: Record<AiProvider, string> = {
  google: 'gemini-flash-latest',
  anthropic: 'claude-haiku-5-5',
};

export const DEFAULT_FALLBACK_MODELS: Record<AiProvider, string | null> = {
  google: 'gemini-flash-lite-latest',
  anthropic: null,
};

export const API_KEY_VARS: Record<AiProvider, string> = {
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
};

export function readAiConfig(env: NodeJS.ProcessEnv = process.env): AiConfig {
  const provider: AiProvider =
    env.AI_PROVIDER?.toLowerCase() === 'anthropic' ? 'anthropic' : 'google';
  const limit = Number.parseInt(env.AI_DAILY_LIMIT ?? '', 10);
  const timeout = Number.parseInt(env.AI_TIMEOUT_MS ?? '', 10);
  const model = env.AI_MODEL?.trim() || DEFAULT_MODELS[provider];
  const fallback = env.AI_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK_MODELS[provider];

  return {
    enabled: Boolean(env[API_KEY_VARS[provider]]?.trim()),
    provider,
    model,
    fallbackModel: fallback === 'none' || fallback === model ? null : fallback,
    dailyLimit: Number.isFinite(limit) && limit > 0 ? limit : 150,
    timeoutMs: Number.isFinite(timeout) && timeout >= 5000 ? timeout : 45_000,
    thinking: (['minimal', 'low', 'medium', 'high'] as const).find(
      (level) => level === env.AI_THINKING?.trim().toLowerCase(),
    ) ?? 'low',
  };
}

/**
 * Options du fournisseur qui limitent la « réflexion » du modèle :
 * c'est la principale source de lenteur des modèles Gemini récents.
 */
export function speedOptions(
  config: AiConfig,
  modelId: string | null,
): SharedV4ProviderOptions | undefined {
  if (config.provider !== 'google' || !modelId) return undefined;
  if (/gemini-2\.0|gemma/.test(modelId)) return undefined;
  if (/gemini-2\.5/.test(modelId)) {
    // Gemini 2.5 : budget de réflexion (0 = désactivée, sauf modèles Pro).
    return modelId.includes('pro')
      ? undefined
      : { google: { thinkingConfig: { thinkingBudget: config.thinking === 'high' ? -1 : 0 } } };
  }
  return { google: { thinkingConfig: { thinkingLevel: config.thinking } } };
}

export function createModel(
  config: AiConfig,
  env: NodeJS.ProcessEnv = process.env,
  modelId: string | null = config.model,
): LanguageModel | null {
  if (!config.enabled || !modelId) return null;

  if (config.provider === 'anthropic') {
    return createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })(modelId);
  }

  return createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  })(modelId);
}
