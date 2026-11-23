import { createHmac } from 'node:crypto';

import { parseTransaction, readNotchPayConfig, validSignature } from './notchpay.client.js';

describe('NotchPay', () => {
  it('désactivé sans clé, URL par défaut', () => {
    expect(readNotchPayConfig({})).toEqual({ publicKey: null, hashKey: null, apiUrl: 'https://api.notchpay.co' });
    expect(readNotchPayConfig({ NOTCHPAY_PUBLIC_KEY: ' pk_test_1 ', NOTCHPAY_API_URL: 'http://x/' })).toMatchObject({ publicKey: 'pk_test_1', apiUrl: 'http://x' });
  });

  it('lit la transaction, à la racine ou sous « transaction »', () => {
    expect(parseTransaction({ transaction: { id: 'pay_1', reference: 'r1', status: 'Complete', amount: 2500, currency: 'XAF' } }))
      .toEqual({ id: 'pay_1', reference: 'r1', status: 'complete', amount: 2500, currency: 'XAF' });
    expect(parseTransaction({ status: 'failed', reference: 'r2' })).toMatchObject({ status: 'failed', reference: 'r2' });
    expect(parseTransaction({ message: 'ok' })).toBeNull();
  });

  it('refuse une signature fausse ou absente', () => {
    const raw = '{"event":"payment.complete"}';
    const good = createHmac('sha256', 'hsk_test_1').update(raw).digest('hex');
    expect(validSignature(raw, good, 'hsk_test_1')).toBe(true);
    expect(validSignature(raw, good, 'autre')).toBe(false);
    expect(validSignature(raw, undefined, 'hsk_test_1')).toBe(false);
    expect(validSignature(raw, 'abc', 'hsk_test_1')).toBe(false);
  });
});
