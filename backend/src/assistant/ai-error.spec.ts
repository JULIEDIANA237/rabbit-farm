import { describeAiError, isOverloaded } from './ai-error';

const apiError = (statusCode: number, responseBody = '') =>
  Object.assign(new Error('API call failed'), { name: 'AI_APICallError', statusCode, responseBody });

describe('describeAiError', () => {
  it('signale un délai dépassé', () => {
    const timeout = Object.assign(new Error('timeout'), { name: 'TimeoutError' });
    expect(describeAiError(timeout, 'google')).toContain('trop de temps');
  });

  it('remonte la dernière erreur des nouvelles tentatives', () => {
    const retry = Object.assign(new Error('Failed after 2 attempts'), { name: 'AI_RetryError', lastError: apiError(429) });
    expect(describeAiError(retry, 'google')).toContain('quota');
  });

  it('désigne la clé refusée', () => {
    expect(describeAiError(apiError(400, '{"reason":"API_KEY_INVALID"}'), 'google')).toContain('GOOGLE_GENERATIVE_AI_API_KEY');
    expect(describeAiError(apiError(401), 'anthropic')).toContain('ANTHROPIC_API_KEY');
  });

  it('explique un problème de certificat', () => {
    const failed = new TypeError('fetch failed', { cause: Object.assign(new Error('x'), { code: 'SELF_SIGNED_CERT_IN_CHAIN' }) });
    expect(describeAiError(failed, 'google')).toContain('antivirus');
  });

  it('garde un message générique sinon', () => {
    expect(describeAiError(new Error('bizarre'), 'google')).toContain('ne répond pas');
  });
});

describe('isOverloaded', () => {
  it('reconnaît un modèle saturé, même derrière les nouvelles tentatives', () => {
    expect(isOverloaded(apiError(503))).toBe(true);
    expect(isOverloaded(Object.assign(new Error('retry'), { lastError: apiError(429) }))).toBe(true);
  });

  it('ignore les autres erreurs', () => {
    expect(isOverloaded(apiError(400))).toBe(false);
    expect(isOverloaded(new Error('fetch failed'))).toBe(false);
  });
});
