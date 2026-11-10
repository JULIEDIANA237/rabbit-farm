import { readAiConfig } from './ai-config';

describe('readAiConfig', () => {
  it('utilise Gemini par défaut et se désactive sans clé', () => {
    expect(readAiConfig({})).toEqual({ enabled: false, provider: 'google', model: 'gemini-flash-latest', fallbackModel: 'gemini-flash-lite-latest', dailyLimit: 150, timeoutMs: 45_000 });
  });

  it('s’active avec la clé du fournisseur choisi', () => {
    expect(readAiConfig({ GOOGLE_GENERATIVE_AI_API_KEY: 'k' }).enabled).toBe(true);
    expect(readAiConfig({ AI_PROVIDER: 'anthropic', GOOGLE_GENERATIVE_AI_API_KEY: 'k' }).enabled).toBe(false);
    expect(
      readAiConfig({ AI_PROVIDER: 'Anthropic', ANTHROPIC_API_KEY: 'k', AI_MODEL: 'claude-sonnet-5-5', AI_DAILY_LIMIT: '20' }),
    ).toEqual({ enabled: true, provider: 'anthropic', model: 'claude-sonnet-5-5', fallbackModel: null, dailyLimit: 20, timeoutMs: 45_000 });
  });
});
