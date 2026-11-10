import { describeNetworkError } from './network-error';

describe('describeNetworkError', () => {
  const fetchFailed = (code: string) => {
    const error = new Error('fetch failed') as Error & { originalError?: unknown };
    error.originalError = Object.assign(new TypeError('fetch failed'), { cause: Object.assign(new Error('x'), { code }) });
    return error;
  };

  it('repère un certificat intercepté par un antivirus', () => {
    expect(describeNetworkError(fetchFailed('SELF_SIGNED_CERT_IN_CHAIN'))).toContain('antivirus');
    expect(describeNetworkError(fetchFailed('UNABLE_TO_GET_ISSUER_CERT_LOCALLY'))).toContain('antivirus');
  });

  it('repère une adresse introuvable ou une coupure', () => {
    expect(describeNetworkError(fetchFailed('ENOTFOUND'))).toContain('SUPABASE_URL');
    expect(describeNetworkError(fetchFailed('ECONNRESET'))).toContain('réseau instable');
  });

  it('garde le message quand aucune cause n’est connue', () => {
    expect(describeNetworkError(new Error('quota'))).toBe('quota');
  });
});
