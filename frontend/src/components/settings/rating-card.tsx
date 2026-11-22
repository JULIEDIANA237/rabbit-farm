'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Star } from 'lucide-react';

import { Button, Card, ErrorBox, Textarea } from '@/components/ui/kit';

export const MY_APP_RATING = gql`
  query MyAppRating { myAppRating { id stars comment } }
`;
const RATE_APP = gql`
  mutation RateApp($stars: Int!, $comment: String) {
    rateApp(stars: $stars, comment: $comment) { id stars comment }
  }
`;

type Rating = { id: string; stars: number; comment?: string | null };

/** Étoiles cliquables de 1 à 5. */
export function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="rounded p-0.5 transition hover:scale-110"
        >
          <Star size={28} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  );
}

/** Formulaire de note, partagé par Paramètres et l'invite du tableau de bord. */
export function useRateApp() {
  const { data } = useQuery<{ myAppRating: Rating | null }>(MY_APP_RATING);
  const [rate, state] = useMutation<{ rateApp: Rating }>(RATE_APP, {
    refetchQueries: [{ query: MY_APP_RATING }],
  });
  return { rating: data?.myAppRating ?? null, loaded: data !== undefined, rate, state };
}

export function RatingCard() {
  const { rating, loaded, rate, state } = useRateApp();
  if (!loaded) return null;
  // Rendu une fois la note chargée : elle sert de valeur de départ au formulaire.
  return <RatingForm rating={rating} rate={rate} state={state} />;
}

function RatingForm({ rating, rate, state }: { rating: Rating | null } & Pick<ReturnType<typeof useRateApp>, 'rate' | 'state'>) {
  const [stars, setStars] = useState(rating?.stars ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? '');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaved(false);
    await rate({ variables: { stars, comment: comment.trim() || null } });
    setSaved(true);
  };

  return (
    <Card title="Noter l’application" subtitle="Ton avis nous aide à améliorer Rabbit Farm.">
      <div className="space-y-3">
        <StarPicker value={stars} onChange={(n) => { setStars(n); setSaved(false); }} />
        <Textarea
          rows={3}
          placeholder="Un commentaire (facultatif) : ce qui te plaît, ce qui manque…"
          value={comment}
          onChange={(e) => { setComment(e.target.value); setSaved(false); }}
        />
        <ErrorBox error={state.error} />
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={stars === 0} loading={state.loading}>
            {rating ? 'Mettre à jour ma note' : 'Envoyer ma note'}
          </Button>
          {saved && <span className="text-sm text-emerald-700">Merci pour ta note !</span>}
        </div>
      </div>
    </Card>
  );
}
