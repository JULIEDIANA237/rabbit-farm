'use client';

import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Bell, BellOff } from 'lucide-react';

import { Button, Card, ErrorBox } from '@/components/ui/kit';

const PUSH_CONFIG = gql`
  query PushConfig {
    pushConfig {
      enabled
      publicKey
    }
  }
`;
const SUBSCRIBE = gql`
  mutation SubscribePush($input: PushSubscriptionInput!) {
    subscribePush(input: $input)
  }
`;
const UNSUBSCRIBE = gql`
  mutation UnsubscribePush($endpoint: String!) {
    unsubscribePush(endpoint: $endpoint)
  }
`;
const SEND_TEST = gql`
  mutation SendTestPush {
    sendTestPush
  }
`;

function base64ToBytes(base64: string) {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

type State = 'loading' | 'unsupported' | 'denied' | 'off' | 'on';

/** Active les rappels du matin (tâches du jour, retards, mises bas proches). */
export function NotificationsCard() {
  const { data } = useQuery<{ pushConfig: { enabled: boolean; publicKey: string | null } }>(PUSH_CONFIG);
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);
  const [sendTest] = useMutation<{ sendTestPush: number }>(SEND_TEST);
  const [state, setState] = useState<State>('loading');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setState('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        setState('denied');
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration();
      const existing = await registration?.pushManager.getSubscription();
      setState(existing ? 'on' : 'off');
    };
    void check().catch(() => setState('unsupported'));
  }, []);

  async function enable() {
    if (!data?.pushConfig.publicKey) return;
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off');
        return;
      }
      const registration = (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register('/sw.js'));
      await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToBytes(data.pushConfig.publicKey),
      });
      const json = subscription.toJSON();
      await subscribe({ variables: { input: { endpoint: json.endpoint, p256dh: json.keys?.p256dh, auth: json.keys?.auth } } });
      setState('on');
      const result = await sendTest();
      setInfo(result.data?.sendTestPush ? 'Notification d’essai envoyée sur cet appareil.' : null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Activation impossible.');
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await unsubscribe({ variables: { endpoint: subscription.endpoint } });
        await subscription.unsubscribe();
      }
      setState('off');
      setInfo(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Désactivation impossible.');
    } finally {
      setBusy(false);
    }
  }

  const configured = data?.pushConfig.enabled;

  return (
    <Card title="Rappels du jour" subtitle="Une notification chaque matin vers 6 h : tâches du jour, retards et mises bas proches.">
      <div className="space-y-3 text-sm text-slate-600">
        {data && !configured && <p>Les notifications ne sont pas encore configurées sur le serveur (clés VAPID manquantes).</p>}
        {configured && state === 'unsupported' && (
          <p>Ce navigateur ne gère pas les notifications. Sur iPhone, installe d’abord l’app sur l’écran d’accueil.</p>
        )}
        {configured && state === 'denied' && (
          <p>Les notifications sont bloquées pour ce site. Autorise-les dans les réglages du navigateur, puis recharge la page.</p>
        )}
        {configured && state === 'on' && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
              <Bell size={16} /> Activés sur cet appareil
            </span>
            <Button variant="secondary" onClick={() => void sendTest().then((r) => setInfo(r.data?.sendTestPush ? 'Notification d’essai envoyée.' : 'Aucun appareil atteint.'))}>
              Envoyer un essai
            </Button>
            <Button variant="secondary" loading={busy} onClick={() => void disable()}>
              <BellOff size={16} /> Désactiver
            </Button>
          </div>
        )}
        {configured && state === 'off' && (
          <Button loading={busy} onClick={() => void enable()}>
            <Bell size={16} /> Activer sur cet appareil
          </Button>
        )}
        {info && <p className="text-emerald-700">{info}</p>}
        <ErrorBox error={error} />
      </div>
    </Card>
  );
}
