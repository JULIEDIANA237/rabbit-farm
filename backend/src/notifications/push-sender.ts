import * as webpush from 'web-push';

export interface PushConfig {
  enabled: boolean;
  publicKey: string | null;
}

/**
 * Clés VAPID des notifications. Pour les créer une fois :
 *   npx web-push generate-vapid-keys
 * puis VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY et VAPID_SUBJECT (mailto:…).
 */
export function readPushConfig(env: NodeJS.ProcessEnv = process.env): PushConfig {
  const publicKey = env.VAPID_PUBLIC_KEY?.trim() || null;
  const privateKey = env.VAPID_PRIVATE_KEY?.trim();
  return { enabled: Boolean(publicKey && privateKey), publicKey };
}

export interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url: string;
}

export type PushResult = 'sent' | 'gone' | 'failed';

/** Envoie une notification ; « gone » = abonnement expiré à supprimer. */
export async function sendPush(target: PushTarget, payload: PushPayload, env: NodeJS.ProcessEnv = process.env): Promise<PushResult> {
  try {
    await webpush.sendNotification(
      { endpoint: target.endpoint, keys: { p256dh: target.p256dh, auth: target.auth } },
      JSON.stringify(payload),
      {
        TTL: 12 * 3600,
        vapidDetails: {
          subject: env.VAPID_SUBJECT?.trim() || 'mailto:contact@rabbitfarm.app',
          publicKey: env.VAPID_PUBLIC_KEY!.trim(),
          privateKey: env.VAPID_PRIVATE_KEY!.trim(),
        },
      },
    );
    return 'sent';
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    return status === 404 || status === 410 ? 'gone' : 'failed';
  }
}
