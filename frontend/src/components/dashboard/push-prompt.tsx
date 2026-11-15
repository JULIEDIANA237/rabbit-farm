'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';

import { Button, ErrorBox } from '@/components/ui/kit';
import { usePushNotifications } from '@/components/settings/notifications-card';

const DISMISS_KEY = 'rabbitfarm:push-prompt-dismissed';

/**
 * Invite à activer les rappels du jour sur cet appareil, tant qu'ils
 * ne le sont pas. Se masque une fois activés ou si l'utilisateur la ferme.
 */
export function PushPrompt() {
  const push = usePushNotifications();
  // Rendu nul tant que la config n'est pas chargée : pas d'écart d'hydratation.
  const [dismissed, setDismissed] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Stockage indisponible : masqué jusqu'au prochain chargement.
    }
  };

  if (dismissed || !push.configured || push.state === 'loading' || (push.state === 'on' && !push.info)) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <Bell size={20} className="mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <p>
          <strong>Reçois tes rappels sur ce téléphone.</strong> Chaque matin vers 6 h : tâches du jour, retards et mises bas
          proches.
        </p>
        {push.info ? (
          <p className="font-medium">{push.info}</p>
        ) : push.state === 'denied' && isIOS() ? (
          <p>
            Les notifications sont <strong>bloquées</strong> pour RabbitFarm. Sur iPhone : <em>Réglages</em> →{' '}
            <em>Notifications</em> → <em>RabbitFarm</em> → activer <em>Autoriser les notifications</em>, avec{' '}
            <em>Centre de notifications</em> et <em>Bannières</em>. Reviens ensuite ici.
          </p>
        ) : push.state === 'denied' ? (
          <p>
            Les notifications sont <strong>bloquées</strong> pour RabbitFarm sur ce téléphone. Pour les autoriser : appui long
            sur l’icône de l’app → <em>Infos sur l’appli</em> → <em>Notifications</em> → activer. Dans Chrome : menu ⋮ →{' '}
            <em>Paramètres</em> → <em>Paramètres des sites</em> → <em>Notifications</em>. Reviens ensuite ici.
          </p>
        ) : push.state === 'unsupported' ? (
          <p>
            Ce navigateur ne gère pas les notifications. Sur iPhone (iOS 16.4 ou plus récent), ouvre le site dans{' '}
            <strong>Safari</strong>, bouton Partager → <em>Sur l’écran d’accueil</em>, puis ouvre RabbitFarm depuis l’icône
            et reviens ici.
          </p>
        ) : (
          <Button loading={push.busy} onClick={() => void push.enable()}>
            <Bell size={16} /> Activer les notifications
          </Button>
        )}
        <ErrorBox error={push.error} />
      </div>
      <button type="button" onClick={close} aria-label="Fermer" className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100">
        <X size={18} />
      </button>
    </div>
  );
}

/** iPhone ou iPad (y compris iPadOS qui se présente comme un Mac tactile). */
function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1);
}
