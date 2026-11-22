'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';

import { Button } from '@/components/ui/kit';
import { StarPicker, useRateApp } from '@/components/settings/rating-card';

const DISMISS_KEY = 'rabbitfarm:rating-prompt-dismissed';

/** Petite invite à noter l'app, tant que l'utilisateur ne l'a pas notée ni fermée. */
export function RatingPrompt() {
  const { rating, loaded, rate, state } = useRateApp();
  const [stars, setStars] = useState(0);
  const [thanks, setThanks] = useState(false);
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

  if (thanks) {
    return <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Merci pour ta note ! Tu peux la modifier dans Paramètres.</p>;
  }
  if (dismissed || !loaded || rating) return null;

  const send = async () => {
    await rate({ variables: { stars, comment: null } });
    setThanks(true);
  };

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <Star size={20} className="mt-0.5 shrink-0 fill-amber-400 text-amber-500" />
      <div className="flex-1 space-y-2">
        <p className="font-medium">Que penses-tu de Rabbit Farm ?</p>
        <div className="flex flex-wrap items-center gap-3">
          <StarPicker value={stars} onChange={setStars} />
          <Button onClick={send} disabled={stars === 0} loading={state.loading}>Envoyer</Button>
        </div>
      </div>
      <button type="button" onClick={close} aria-label="Fermer" className="rounded p-1 hover:bg-amber-100">
        <X size={16} />
      </button>
    </div>
  );
}
