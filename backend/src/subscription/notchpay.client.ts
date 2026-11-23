import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';

/**
 * NotchPay (Mobile Money MTN / Orange au Cameroun).
 *
 *   NOTCHPAY_PUBLIC_KEY   clé publique (pk_test_… en Sandbox) : création et lecture des paiements
 *   NOTCHPAY_HASH_KEY     « Hash Key » des webhooks : vérifie la signature x-notch-signature
 *   NOTCHPAY_API_URL      optionnel (défaut https://api.notchpay.co)
 *   NOTCHPAY_OPERATORS    opérateurs proposés, séparés par des virgules (défaut MTN ; ex. MTN,ORANGE)
 *
 * Sans clé publique, le paiement en ligne est simplement masqué : le paiement déclaré à la main reste possible.
 * On ne croit jamais le contenu d'un webhook : chaque paiement est relu auprès de NotchPay avant d'activer l'abonnement.
 */

export type MobileOperator = 'MTN' | 'ORANGE';

/** Opérateurs activés sur le compte NotchPay ; MTN seul par défaut (Orange Money pas encore ouvert). */
export function parseOperators(value: string | undefined): MobileOperator[] {
  const list = (value ?? 'MTN').split(',').map((v) => v.trim().toUpperCase()).filter((v): v is MobileOperator => v === 'MTN' || v === 'ORANGE');
  return list.length ? [...new Set(list)] : ['MTN'];
}

export interface NotchPayConfig {
  publicKey: string | null;
  hashKey: string | null;
  apiUrl: string;
  operators: MobileOperator[];
}

export function readNotchPayConfig(env: NodeJS.ProcessEnv = process.env): NotchPayConfig {
  return {
    publicKey: env.NOTCHPAY_PUBLIC_KEY?.trim() || null,
    hashKey: env.NOTCHPAY_HASH_KEY?.trim() || null,
    apiUrl: (env.NOTCHPAY_API_URL?.trim() || 'https://api.notchpay.co').replace(/\/$/, ''),
    operators: parseOperators(env.NOTCHPAY_OPERATORS),
  };
}

export interface CheckoutInput {
  amount: number;
  reference: string;
  email: string;
  description: string;
  callback: string;
  phone?: string;
}

export interface RemotePayment {
  id: string | null;
  reference: string | null;
  status: string;
  amount: number | null;
  currency: string | null;
}

const TIMEOUT = 15_000;

const CHANNEL: Record<MobileOperator, string> = { MTN: 'cm.mtn', ORANGE: 'cm.orange' };

/** Numéro camerounais (6XX XX XX XX, avec ou sans 237) au format +2376XXXXXXXX, sinon null. */
export function normalizeCameroonPhone(input: string): string | null {
  let digits = input.replace(/[^\d]/g, '');
  if (digits.startsWith('00237')) digits = digits.slice(5);
  else if (digits.startsWith('237') && digits.length === 12) digits = digits.slice(3);
  return /^6\d{8}$/.test(digits) ? `+237${digits}` : null;
}

type Json = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' && v ? v : null);

/** Le paiement peut arriver sous « transaction » ou à la racine selon la réponse. */
export function parseTransaction(body: Json): RemotePayment | null {
  const raw = body.transaction;
  const t: Json = raw && typeof raw === 'object' ? (raw as Json) : body;
  const status = str(t.status);
  if (!status) return null;
  return {
    id: str(t.id) ?? (typeof raw === 'string' ? raw : null),
    reference: str(t.reference),
    status: status.toLowerCase(),
    amount: typeof t.amount === 'number' ? t.amount : Number(t.amount) || null,
    currency: str(t.currency),
  };
}

/** Raison lisible d'un refus NotchPay : message + détail des champs refusés. */
export function notchPayReason(body: Json, status: number) {
  const message = typeof body.message === 'string' && body.message ? body.message : `NotchPay a répondu ${status}`;
  const errors = body.errors && typeof body.errors === 'object' ? JSON.stringify(body.errors).slice(0, 300) : '';
  return errors ? `${message} ${errors}` : message;
}

/** Signature HMAC SHA-256 (hex) du corps brut, comparée en temps constant. */
export function validSignature(rawBody: string | Buffer, signature: string | undefined, hashKey: string) {
  if (!signature) return false;
  const expected = createHmac('sha256', hashKey).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim().toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}

@Injectable()
export class NotchPayClient {
  private readonly logger = new Logger('NotchPay');
  protected readonly config = readNotchPayConfig();

  get enabled() {
    return Boolean(this.config.publicKey);
  }

  get operators(): MobileOperator[] {
    return this.config.operators;
  }

  get canVerifyWebhooks() {
    return Boolean(this.config.hashKey);
  }

  private async request(path: string, init: { method?: string; body?: string } = {}): Promise<Json> {
    if (!this.config.publicKey) throw new Error('NotchPay n’est pas configuré.');
    const res = await fetch(`${this.config.apiUrl}${path}`, {
      ...init,
      headers: { Authorization: this.config.publicKey, Accept: 'application/json', 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    const body = (await res.json().catch(() => ({}))) as Json;
    if (!res.ok) {
      const reason = notchPayReason(body, res.status);
      const line = `${init.method ?? 'GET'} ${path} → HTTP ${res.status} : ${reason}`;
      if (init.method) this.logger.error(line);
      else this.logger.warn(line);
      throw new Error(reason);
    }
    return body;
  }

  /** Crée la page de paiement NotchPay ; l'éleveur y choisit MTN ou Orange Money. */
  async checkout(input: CheckoutInput): Promise<{ id: string | null; reference: string | null; url: string }> {
    const body = await this.request('/payments', {
      method: 'POST',
      body: JSON.stringify({
        amount: input.amount,
        currency: 'XAF',
        email: input.email,
        ...(input.phone ? { phone: input.phone } : {}),
        reference: input.reference,
        description: input.description,
        callback: input.callback,
        locked_currency: 'XAF',
      }),
    });
    const url = str(body.authorization_url);
    if (!url) throw new Error('NotchPay n’a pas renvoyé de page de paiement.');
    const trx = parseTransaction(body);
    return { id: trx?.id ?? null, reference: trx?.reference ?? null, url };
  }

  /** Paiement direct : NotchPay envoie la demande de confirmation sur le téléphone, l'éleveur reste dans l'app. */
  async charge(reference: string, operator: MobileOperator, phone: string): Promise<void> {
    await this.request(`/payments/${encodeURIComponent(reference)}`, {
      method: 'POST',
      // La doc NotchPay nomme le numéro tantôt « phone », tantôt « account_number » : on envoie les deux.
      body: JSON.stringify({ channel: CHANNEL[operator], data: { phone, account_number: phone } }),
    });
  }

  /** Relit un paiement chez NotchPay (null s'il est introuvable ou si NotchPay ne répond pas). */
  async retrieve(reference: string): Promise<RemotePayment | null> {
    try {
      return parseTransaction(await this.request(`/payments/${encodeURIComponent(reference)}`));
    } catch {
      return null;
    }
  }

  verify(rawBody: string | Buffer, signature: string | undefined) {
    return Boolean(this.config.hashKey) && validSignature(rawBody, signature, this.config.hashKey as string);
  }
}
