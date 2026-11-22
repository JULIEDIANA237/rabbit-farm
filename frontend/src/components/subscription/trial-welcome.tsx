'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';

import { Button, Modal } from '@/components/ui/kit';
import { formatDate, formatMoney } from '@/lib/format';
import { days, useSubscription } from '@/lib/subscription';

const SEEN_KEY = 'rabbitfarm:trial-welcome-seen';

/** À la première connexion : l'essai gratuit, sa durée et les prix ensuite. */
export function TrialWelcome() {
  const { subscription: s } = useSubscription();
  const [seen, setSeen] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  if (seen || !s || s.status !== 'TRIAL') return null;

  const close = () => {
    setSeen(true);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Stockage indisponible : le message reviendra au prochain chargement.
    }
  };

  return (
    <Modal open title="Bienvenue sur Rabbit Farm !" onClose={close} footer={<Button onClick={close}>C’est parti</Button>}>
      <div className="space-y-3 text-sm text-slate-700">
        <p className="flex items-center gap-2 text-base font-medium text-emerald-800">
          <Gift size={20} /> Ton accès est gratuit pendant {days(s.settings.trialDays)}.
        </p>
        <p>
          Profite de toutes les fonctions jusqu’au <strong>{formatDate(s.trialEndsAt)}</strong> (encore {days(s.daysLeft)}).
        </p>
        <p>
          Ensuite, l’abonnement coûte <strong>{formatMoney(s.settings.monthlyPrice)} par mois</strong> ou{' '}
          <strong>{formatMoney(s.settings.yearlyPrice)} par an</strong>. Sans abonnement, tes données restent consultables
          mais tu ne pourras plus en ajouter.
        </p>
      </div>
    </Modal>
  );
}
