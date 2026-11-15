'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { CheckCircle2 } from 'lucide-react';

import { Button, ErrorBox, Loading, PageHeader } from '@/components/ui/kit';
import {
  RabbitHistoryFields,
  historyFromRabbit,
  historyPayload,
  type RabbitHistoryValues,
} from '@/components/rabbits/RabbitHistoryFields';
import { BREEDERS_PAST, isBreeder, needsPast, type BreederPast } from '@/components/rabbits/breeders-past';
import type { RabbitSex } from '@/types/rabbit';

const SAVE_PAST = gql`
  mutation SaveBreederPast($input: UpdateRabbitInput!) { updateRabbit(input: $input) { id } }
`;

/**
 * Passé des reproducteurs déjà enregistrés : l'app pose les questions
 * oubliées (mises bas, pertes, cannibalisme, femelles couvertes…)
 * pour chaque femelle et chaque mâle, un par un.
 */
export default function BreedersPastPage() {
  const { data, loading, error } = useQuery<{ rabbitsPaginated: { items: BreederPast[] } }>(BREEDERS_PAST, {
    fetchPolicy: 'cache-and-network',
  });
  const [showDone, setShowDone] = useState(false);
  if (loading && !data) return <Loading />;
  const breeders = (data?.rabbitsPaginated.items ?? []).filter(isBreeder);
  const todo = breeders.filter(needsPast);
  const done = breeders.filter((r) => !needsPast(r));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Lapins"
        title="Passé de mes reproducteurs"
        description="Réponds à ce que tu sais pour chaque femelle et chaque mâle. Ces réponses s’affichent avant chaque saillie."
      />
      <ErrorBox error={error} />
      {todo.length === 0 ? (
        <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} /> Tous tes reproducteurs ont leur passé renseigné.
        </p>
      ) : (
        <p className="text-sm text-slate-600">{todo.length} reproducteur(s) à compléter.</p>
      )}
      {todo.map((rabbit) => (
        <PastCard key={rabbit.id} rabbit={rabbit} />
      ))}
      {done.length > 0 && (
        <div>
          <button type="button" className="text-sm font-medium text-emerald-700 hover:underline" onClick={() => setShowDone((v) => !v)}>
            {showDone ? 'Masquer' : 'Revoir'} les {done.length} reproducteur(s) déjà renseigné(s)
          </button>
          {showDone && (
            <div className="mt-3 space-y-5">
              {done.map((rabbit) => (
                <PastCard key={rabbit.id} rabbit={rabbit} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PastCard({ rabbit }: { rabbit: BreederPast }) {
  const [values, setValues] = useState<RabbitHistoryValues>(() => historyFromRabbit(rabbit));
  const [saved, setSaved] = useState(false);
  const [save, { loading, error }] = useMutation(SAVE_PAST, { refetchQueries: ['BreedersPast'] });
  const sex = rabbit.sex as RabbitSex;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link href={`/rabbits/${rabbit.id}`} className="text-lg font-bold text-slate-900 hover:text-emerald-700">
          {rabbit.code}
          <span className="ml-2 text-sm font-normal text-slate-500">{sex === 'FEMALE' ? 'Femelle' : 'Mâle'}</span>
        </Link>
        {saved && <span className="text-sm text-emerald-700">Enregistré</span>}
      </div>
      <RabbitHistoryFields
        sex={sex}
        values={values}
        onChange={(next) => {
          setSaved(false);
          setValues(next);
        }}
      />
      <ErrorBox error={error} />
      <div className="mt-3 flex justify-end">
        <Button
          loading={loading}
          onClick={() =>
            save({ variables: { input: { id: rabbit.id, ...historyPayload(values, sex, true) } } })
              .then(() => setSaved(true))
              .catch(() => undefined)
          }
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
