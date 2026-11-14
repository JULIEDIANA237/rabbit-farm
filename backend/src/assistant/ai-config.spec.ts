import { readAiConfig, speedOptions } from './ai-config.js';

describe('readAiConfig', () => {
  it('utilise Gemini par défaut et se désactive sans clé', () => {
    expect(readAiConfig({})).toEqual({ enabled: false, provider: 'google', model: 'gemini-flash-latest', fallbackModel: 'gemini-flash-lite-latest', dailyLimit: 150, timeoutMs: 45_000, thinking: 'low' });
  });

  it('s’active avec la clé du fournisseur choisi', () => {
    expect(readAiConfig({ GOOGLE_GENERATIVE_AI_API_KEY: 'k' }).enabled).toBe(true);
    expect(readAiConfig({ AI_PROVIDER: 'anthropic', GOOGLE_GENERATIVE_AI_API_KEY: 'k' }).enabled).toBe(false);
    expect(
      readAiConfig({ AI_PROVIDER: 'Anthropic', ANTHROPIC_API_KEY: 'k', AI_MODEL: 'claude-sonnet-5-5', AI_DAILY_LIMIT: '20' }),
    ).toEqual({ enabled: true, provider: 'anthropic', model: 'claude-sonnet-5-5', fallbackModel: null, dailyLimit: 20, timeoutMs: 45_000, thinking: 'low' });
  });
});

describe('speedOptions', () => {
  const config = readAiConfig({ GOOGLE_GENERATIVE_AI_API_KEY: 'k' });

  it('limite la réflexion des modèles Gemini récents', () => {
    expect(speedOptions(config, 'gemini-flash-latest')).toEqual({
      google: { thinkingConfig: { thinkingLevel: 'low' } },
    });
    expect(speedOptions({ ...config, thinking: 'minimal' }, 'gemini-3.5-flash')).toEqual({
      google: { thinkingConfig: { thinkingLevel: 'minimal' } },
    });
  });

  it('désactive la réflexion de Gemini 2.5 Flash et ne touche pas aux autres', () => {
    expect(speedOptions(config, 'gemini-2.5-flash')).toEqual({
      google: { thinkingConfig: { thinkingBudget: 0 } },
    });
    expect(speedOptions(config, 'gemini-2.5-pro')).toBeUndefined();
    expect(speedOptions(config, 'gemini-2.0-flash')).toBeUndefined();
    expect(
      speedOptions(readAiConfig({ AI_PROVIDER: 'anthropic', ANTHROPIC_API_KEY: 'k' }), 'claude-haiku-5-5'),
    ).toBeUndefined();
  });

  it('lit AI_THINKING', () => {
    expect(readAiConfig({ AI_THINKING: 'Minimal' }).thinking).toBe('minimal');
    expect(readAiConfig({ AI_THINKING: 'n’importe' }).thinking).toBe('low');
  });
});
