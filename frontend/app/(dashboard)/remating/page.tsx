'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

import { Button, Card, ErrorBox, Field, FormGrid, Input, Loading, PageHeader, Select } from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { formatDate } from '@/lib/format';

const REMATING_CONTEXT = gql`
  query RematingContext($femaleId: ID!) {
    rematingContext(femaleId: $femaleId) { femaleId femaleCode lastBirthDate daysSinceBirth kitsNursing lastWeightKg taskId }
  }
`;
const ASSESS = gql`
  mutation AssessRemating($input: AssessRematingInput!) {
    assessRemating(input: $input) { verdict title waitDays reasons advice nextCheck }
  }
`;

type Context = {
  femaleId: string; femaleCode: string; lastBirthDate?: string | null; daysSinceBirth?: number | null;
  kitsNursing: number; lastWeightKg?: number | null; taskId?: string | null;
};
type Assessment = { verdict: 'READY' | 'WAIT' | 'NOT_READY'; title: string; waitDays: number; reasons: string[]; advice: string[]; nextCheck?: string | null };

export default function RematingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reproduction"
        title="Ressaillir une femelle ?"
        description="Réponds à quelques questions : l’app te dit si la femelle est prête pour une nouvelle saillie."
      />
      <Suspense fallback={<Loading />}>
        <RematingForm />
      </Suspense>
    </div>
  );
}

function RematingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const femaleId = params.get('femaleId') ?? '';
  const females = useRabbitOptions({ sex: 'FEMALE' });
  const { data, loading, error } = useQuery<{ rematingContext: Context }>(REMATING_CONTEXT, {
    variables: { femaleId },
    skip: !femaleId,
    fetchPolicy: 'network-only',
  });
  const ctx = data?.rematingContext;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="La femelle">
        <Field label="Femelle">
          <Select
            placeholder="Choisir…"
            options={females.options}
            value={femaleId}
            onChange={(e) => router.replace(`/remating?femaleId=${e.target.value}`)}
          />
        </Field>
        {loading && <Loading />}
        <ErrorBox error={error} />
        {ctx && (
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            <li>
              Dernière mise bas :{' '}
              {ctx.lastBirthDate ? `${formatDate(ctx.lastBirthDate)} (il y a ${ctx.daysSinceBirth} jours)` : 'aucune enregistrée'}
            </li>
            <li>Lapereaux qu’elle allaite : {ctx.kitsNursing}</li>
            <li>Dernier poids connu : {ctx.lastWeightKg != null ? `${ctx.lastWeightKg} kg` : 'aucun'}</li>
          </ul>
        )}
      </Card>
      {ctx && <Questionnaire key={ctx.femaleId} ctx={ctx} />}
    </div>
  );
}

const YES_NO = [
  { value: 'no', label: 'Non' },
  { value: 'yes', label: 'Oui' },
];

function Questionnaire({ ctx }: { ctx: Context }) {
  const [form, setForm] = useState({ weightKg: '', bodyCondition: 'GOOD', mastitis: 'no', sick: 'no', goodAppetite: 'yes', vulva: 'UNKNOWN' });
  const [result, setResult] = useState<Assessment | null>(null);
  const [assess, state] = useMutation<{ assessRemating: Assessment }>(ASSESS, { refetchQueries: ['Tasks', 'HeaderTasks', 'FarmSuggestions'] });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm({ ...form, [k]: e.target.value });
    setResult(null);
  };

  const submit = async () => {
    const weight = Number(form.weightKg.replace(',', '.'));
    const r = await assess({
      variables: {
        input: {
          femaleId: ctx.femaleId,
          weightKg: form.weightKg.trim() && weight > 0 ? weight : null,
          bodyCondition: form.bodyCondition,
          mastitis: form.mastitis === 'yes',
          sick: form.sick === 'yes',
          goodAppetite: form.goodAppetite === 'yes',
          vulva: form.vulva,
        },
      },
    });
    setResult(r.data?.assessRemating ?? null);
  };

  return (
    <Card title={`Questionnaire : ${ctx.femaleCode}`}>
      <FormGrid>
        <Field label="Poids aujourd’hui (kg)" hint={ctx.lastWeightKg != null ? `Avant : ${ctx.lastWeightKg} kg` : 'Facultatif, mais conseillé'}>
          <Input inputMode="decimal" placeholder="Ex. : 4,2" value={form.weightKg} onChange={set('weightKg')} />
        </Field>
        <Field label="État du corps" hint="Passe la main sur le dos et les hanches.">
          <Select
            options={[
              { value: 'THIN', label: 'Maigre (os bien saillants)' },
              { value: 'GOOD', label: 'Bon état' },
              { value: 'FAT', label: 'Grasse' },
            ]}
            value={form.bodyCondition}
            onChange={set('bodyCondition')}
          />
        </Field>
        <Field label="Mamelles dures, rouges ou chaudes ?">
          <Select options={YES_NO} value={form.mastitis} onChange={set('mastitis')} />
        </Field>
        <Field label="Signe de maladie ?" hint="Diarrhée, nez qui coule, gale, abcès, blessure…">
          <Select options={YES_NO} value={form.sick} onChange={set('sick')} />
        </Field>
        <Field label="Elle mange bien ?">
          <Select options={[{ value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non, peu' }]} value={form.goodAppetite} onChange={set('goodAppetite')} />
        </Field>
        <Field label="Couleur de la vulve" hint="Rouge ou violacée = en chaleur.">
          <Select
            options={[
              { value: 'UNKNOWN', label: 'Je ne sais pas' },
              { value: 'PALE', label: 'Pâle, blanche' },
              { value: 'PINK', label: 'Rose' },
              { value: 'RED', label: 'Rouge ou violacée' },
            ]}
            value={form.vulva}
            onChange={set('vulva')}
          />
        </Field>
      </FormGrid>
      <ErrorBox error={state.error} />
      <Button className="mt-4" loading={state.loading} onClick={() => submit().catch(() => undefined)}>
        Est-elle prête ?
      </Button>
      {result && <Verdict result={result} ctx={ctx} />}
    </Card>
  );
}

const VIEW = {
  READY: { icon: CheckCircle2, cls: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  WAIT: { icon: Clock, cls: 'border-amber-200 bg-amber-50 text-amber-900' },
  NOT_READY: { icon: XCircle, cls: 'border-red-200 bg-red-50 text-red-900' },
};

function Verdict({ result, ctx }: { result: Assessment; ctx: Context }) {
  const { icon: Icon, cls } = VIEW[result.verdict];
  return (
    <div className={`mt-4 space-y-2 rounded-2xl border p-4 text-sm ${cls}`}>
      <p className="flex items-center gap-2 text-base font-semibold">
        <Icon size={20} /> {result.title}
      </p>
      <ul className="list-disc space-y-0.5 pl-5">
        {result.reasons.map((r) => <li key={r}>{r}</li>)}
      </ul>
      <p className="font-medium">Conseils</p>
      <ul className="list-disc space-y-0.5 pl-5">
        {result.advice.map((a) => <li key={a}>{a}</li>)}
      </ul>
      {result.nextCheck && <p>L’app te reposera la question le {formatDate(result.nextCheck)}.</p>}
      {result.verdict !== 'NOT_READY' && (
        <Link
          href={`/breeding?new=1&prefill=${encodeURIComponent(JSON.stringify({ femaleId: ctx.femaleId }))}`}
          className="inline-flex rounded-xl bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-700"
        >
          {result.verdict === 'READY' ? 'Enregistrer la saillie' : 'Saillir quand même'}
        </Link>
      )}
    </div>
  );
}
