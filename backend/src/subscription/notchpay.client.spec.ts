import { createHmac } from 'node:crypto';

import { normalizeCameroonPhone, notchPayReason, parseOperators, parseTransaction, readNotchPayConfig, validSignature } from './notchpay.client.js';

describe('NotchPay', () => {
  it('désactivé sans clé, URL par défaut', () => {
    expect(readNotchPayConfig({})).toEqual({ publicKey: null, hashKey: null, apiUrl: 'https://api.notchpay.co', operators: ['MTN'] });
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

describe('normalizeCameroonPhone', () => {
  it('accepte les formats courants et refuse le reste', () => {
    expect(normalizeCameroonPhone('670 00 00 00')).toBe('+237670000000');
    expect(normalizeCameroonPhone('+237 690-00-00-00')).toBe('+237690000000');
    expect(normalizeCameroonPhone('00237670000000')).toBe('+237670000000');
    expect(normalizeCameroonPhone('237670000000')).toBe('+237670000000');
    expect(normalizeCameroonPhone('22 22 22 22')).toBeNull();
    expect(normalizeCameroonPhone('67000000')).toBeNull();
  });
});

describe('notchPayReason', () => {
  it('donne le message et le détail des champs refusés', () => {
    expect(notchPayReason({ message: 'Invalid data', errors: { phone: ['required'] } }, 422)).toBe('Invalid data {"phone":["required"]}');
    expect(notchPayReason({}, 500)).toBe('NotchPay a répondu 500');
  });
});

describe('parseOperators', () => {
  it('MTN par défaut, liste nettoyée sinon', () => {
    expect(parseOperators(undefined)).toEqual(['MTN']);
    expect(parseOperators('mtn, orange,MTN')).toEqual(['MTN', 'ORANGE']);
    expect(parseOperators('wave')).toEqual(['MTN']);
  });
});
