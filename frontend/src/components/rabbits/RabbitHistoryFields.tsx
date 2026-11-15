'use client';

import type { RabbitSex } from '@/types/rabbit';

/** Réponses aux questions sur le passé d'un reproducteur, en texte de formulaire. */
export interface RabbitHistoryValues {
  origin: string;
  previousLitters: string;
  previousKitsBorn: string;
  lastBirthDate: string;
  maternalBehavior: string;
  previousMatings: string;
  healthHistory: string;
}

export const emptyHistory: RabbitHistoryValues = {
  origin: '',
  previousLitters: '',
  previousKitsBorn: '',
  lastBirthDate: '',
  maternalBehavior: '',
  previousMatings: '',
  healthHistory: '',
};

export function historyFromRabbit(rabbit: Partial<Record<keyof RabbitHistoryValues, unknown>>): RabbitHistoryValues {
  const text = (v: unknown) => (v == null ? '' : String(v));
  return {
    origin: text(rabbit.origin),
    previousLitters: text(rabbit.previousLitters),
    previousKitsBorn: text(rabbit.previousKitsBorn),
    lastBirthDate: rabbit.lastBirthDate ? String(rabbit.lastBirthDate).slice(0, 10) : '',
    maternalBehavior: text(rabbit.maternalBehavior),
    previousMatings: text(rabbit.previousMatings),
    healthHistory: text(rabbit.healthHistory),
  };
}

const int = (v: string) => (v.trim() === '' ? null : Math.max(0, Number.parseInt(v, 10) || 0));

/**
 * Champs envoyés à l'API. `forUpdate` envoie null pour effacer un champ vidé ;
 * à la création, les champs vides sont simplement omis.
 */
export function historyPayload(values: RabbitHistoryValues, sex: RabbitSex, forUpdate = false) {
  const female = sex === 'FEMALE';
  const male = sex === 'MALE';
  const text = (v: string) => v.trim() || null;
  const payload = {
    origin: text(values.origin),
    previousLitters: female ? int(values.previousLitters) : null,
    previousKitsBorn: female ? int(values.previousKitsBorn) : null,
    lastBirthDate: female && values.lastBirthDate ? values.lastBirthDate : null,
    maternalBehavior: female ? text(values.maternalBehavior) : null,
    previousMatings: male ? int(values.previousMatings) : null,
    healthHistory: text(values.healthHistory),
  };
  if (forUpdate) return payload;
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v != null));
}

const input =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

function Question({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

/** Questions générales posées à la création d'un reproducteur. */
export function RabbitHistoryFields({
  sex,
  values,
  onChange,
}: {
  sex: RabbitSex;
  values: RabbitHistoryValues;
  onChange: (next: RabbitHistoryValues) => void;
}) {
  const set = (key: keyof RabbitHistoryValues) => (e: { target: { value: string } }) =>
    onChange({ ...values, [key]: e.target.value });
  const female = sex === 'FEMALE';
  const male = sex === 'MALE';

  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-slate-900">
        {female ? 'Son passé de reproductrice' : male ? 'Son passé de reproducteur' : 'Son passé'}
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Réponds à ce que tu sais, laisse vide sinon. Ces réponses s’affichent avant chaque saillie.
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <Question label="D’où vient-il ?">
          <select className={input} value={values.origin} onChange={set('origin')}>
            <option value="">Je ne sais pas</option>
            <option value="Née à la ferme">Né(e) à la ferme</option>
            <option value="Achetée">Acheté(e)</option>
            <option value="Don ou échange">Don ou échange</option>
          </select>
        </Question>
        {female && (
          <>
            <Question label="Combien de mises bas a-t-elle déjà faites ?" hint="Avant de l’enregistrer ici">
              <input className={input} inputMode="numeric" placeholder="ex. 2" value={values.previousLitters} onChange={set('previousLitters')} />
            </Question>
            <Question label="Combien de lapereaux nés vivants au total ?">
              <input className={input} inputMode="numeric" placeholder="ex. 14" value={values.previousKitsBorn} onChange={set('previousKitsBorn')} />
            </Question>
            <Question label="Date de sa dernière mise bas">
              <input className={input} type="date" value={values.lastBirthDate} onChange={set('lastBirthDate')} />
            </Question>
            <Question label="Est-ce une bonne mère ?">
              <select className={input} value={values.maternalBehavior} onChange={set('maternalBehavior')}>
                <option value="">Je ne sais pas</option>
                <option value="GOOD">Oui : nid bien fait, allaite bien</option>
                <option value="AVERAGE">Moyenne</option>
                <option value="POOR">Non : abandonne ou mange ses petits</option>
              </select>
            </Question>
          </>
        )}
        {male && (
          <Question label="Combien de saillies a-t-il déjà faites ?" hint="Avant de l’enregistrer ici">
            <input className={input} inputMode="numeric" placeholder="ex. 10" value={values.previousMatings} onChange={set('previousMatings')} />
          </Question>
        )}
        <Question
          label="Maladies ou problèmes de santé passés"
          hint="Ex. gale des oreilles en mars, diarrhée, mammite… Ajouté aussi au suivi sanitaire."
        >
          <textarea className={`${input} resize-none`} rows={2} value={values.healthHistory} onChange={set('healthHistory')} />
        </Question>
      </div>
    </section>
  );
}
