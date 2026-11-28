'use client';

import { gql } from '@apollo/client';

import { Field, FormGrid, Input, Select } from '@/components/ui/kit';
import { useCageOptions, useLotOptions } from '@/graphql/options';
import { toFloat, toInt } from '@/hooks/use-form';
import { clean, fromDateInput, toDateInput } from '@/lib/format';

/**
 * Saillie ancienne : à 30 jours, la mise bas a eu lieu (petits sous la mère) ;
 * à 65 jours, la portée est déjà sevrée. Le formulaire demande ce qui s'est
 * passé, et l'app enregistre la suite (jusqu'au lot si la portée est sevrée).
 */
export const PAST_BREEDING_MIN_DAYS = 30;
export const PAST_BREEDING_WEANED_DAYS = 65;
const GESTATION_DAYS = 31;
const WEANING_DAYS = 35;

export const RECORD_PAST_BREEDING = gql`
  mutation RecordPastBreeding($input: RecordPastBreedingInput!) {
    recordPastBreeding(input: $input) {
      id
    }
  }
`;

export const PAST_FIELDS = {
  pastBirthDate: '',
  pastLiveBorn: '',
  pastStillBorn: '',
  pastWeaned: '',
  pastAlive: '',
  pastWeaningDate: '',
  pastLotId: '',
  pastCageId: '',
  pastAverageWeight: '',
};
type PastValues = typeof PAST_FIELDS;

const addDays = (date: string, days: number) =>
  toDateInput(new Date(new Date(`${date}T12:00:00Z`).getTime() + days * 86_400_000));

/** Nombre de jours écoulés depuis la date de saillie (jj du formulaire). */
export function daysSince(date: string) {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(`${date}T12:00:00Z`).getTime()) / 86_400_000);
}

const earliest = (a: string, b: string) => (a > b ? b : a);

/** Dates retenues quand l'éleveur ne les change pas. */
function dates(breedingDate: string, values: PastValues) {
  const today = toDateInput();
  const birth = values.pastBirthDate || earliest(addDays(breedingDate, GESTATION_DAYS), today);
  return {
    birth,
    weaning: values.pastWeaningDate || earliest(addDays(birth, WEANING_DAYS), today),
  };
}

const isWeaned = (breedingDate: string) => daysSince(breedingDate) >= PAST_BREEDING_WEANED_DAYS;

/** Petits encore vivants (sous la mère) ou sevrés, selon l'âge de la saillie. */
function survivors(breedingDate: string, values: PastValues) {
  return isWeaned(breedingDate) ? toInt(values.pastWeaned) : (toInt(values.pastAlive) ?? toInt(values.pastLiveBorn));
}

export function pastBreedingReady(breedingDate: string, values: PastValues) {
  const live = toInt(values.pastLiveBorn);
  const kept = survivors(breedingDate, values);
  return live != null && kept != null && kept <= live;
}

export function pastBreedingInput(breedingDate: string, values: PastValues) {
  const { birth, weaning } = dates(breedingDate, values);
  const common = {
    birthDate: fromDateInput(birth),
    liveBorn: toInt(values.pastLiveBorn),
    stillBorn: toInt(values.pastStillBorn) ?? 0,
  };
  if (!isWeaned(breedingDate)) return clean({ ...common, aliveCount: toInt(values.pastAlive) });
  return clean({
    ...common,
    weanedCount: toInt(values.pastWeaned),
    weaningDate: fromDateInput(weaning),
    fatteningLotId: values.pastLotId || undefined,
    cageId: values.pastCageId || undefined,
    averageWeight: toFloat(values.pastAverageWeight),
  });
}

export function PastBreedingFields({
  breedingDate,
  values,
  bind,
}: {
  breedingDate: string;
  values: PastValues;
  bind: (key: keyof PastValues) => {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
  };
}) {
  const lots = useLotOptions();
  const cages = useCageOptions();
  const { birth, weaning } = dates(breedingDate, values);
  const weanedAlready = isWeaned(breedingDate);
  const live = toInt(values.pastLiveBorn);
  const kept = survivors(breedingDate, values);
  const dead = live != null && kept != null ? live - kept : null;
  const days = daysSince(breedingDate);

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {weanedAlready ? 'Saillie ancienne : la portée est déjà sevrée' : 'Saillie ancienne : les petits sont sous la mère'}
        </p>
        <p className="text-sm text-slate-600">
          {weanedAlready
            ? `Cette saillie date de ${days} jours. Dis ce qui s’est passé : l’app enregistre la mise bas, le sevrage et l’entrée des lapereaux dans un lot d’engraissement.`
            : `Cette saillie date de ${days} jours : la mise bas a eu lieu. L’app enregistre la portée, les lapereaux s’affichent sous leur mère, et le sevrage reste à faire.`}
        </p>
      </div>
      <FormGrid>
        <Field label="Date de mise bas" hint="Par défaut : 31 jours après la saillie">
          <Input type="date" value={birth} onChange={bind('pastBirthDate').onChange} />
        </Field>
        <Field label="Nés vivants">
          <Input inputMode="numeric" placeholder="ex. 8" {...bind('pastLiveBorn')} />
        </Field>
        <Field label="Mort-nés" hint="Facultatif">
          <Input inputMode="numeric" placeholder="0" {...bind('pastStillBorn')} />
        </Field>
        {weanedAlready ? (
          <Field
            label="Lapereaux sevrés"
            hint={dead != null && dead > 0 ? `${dead} mort(s) avant le sevrage seront notés` : undefined}
          >
            <Input inputMode="numeric" placeholder="ex. 7" {...bind('pastWeaned')} />
          </Field>
        ) : (
          <Field
            label="Encore vivants aujourd’hui"
            hint={
              dead != null && dead > 0 ? `${dead} mort(s) depuis la naissance seront notés` : 'Laisse vide si tous sont vivants'
            }
          >
            <Input inputMode="numeric" placeholder={values.pastLiveBorn || 'ex. 7'} {...bind('pastAlive')} />
          </Field>
        )}
      </FormGrid>
      {weanedAlready && (
        <FormGrid>
          <Field label="Date du sevrage" hint="Par défaut : 35 jours après la mise bas">
            <Input type="date" value={weaning} onChange={bind('pastWeaningDate').onChange} />
          </Field>
          <Field label="Poids moyen au sevrage (kg)" hint="Facultatif : point de départ du suivi du lot">
            <Input inputMode="decimal" placeholder="ex. 0,8" {...bind('pastAverageWeight')} />
          </Field>
          <Field label="Lot d’engraissement">
            <Select placeholder="Nouveau lot pour cette portée" options={lots.options} {...bind('pastLotId')} />
          </Field>
          <Field label="Cage d’engraissement" hint="Facultatif : le lot y est logé">
            <Select placeholder="Pas encore de cage" options={cages.options} {...bind('pastCageId')} />
          </Field>
        </FormGrid>
      )}
      {kept != null && live != null && kept > live && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
          {weanedAlready
            ? 'Il ne peut pas y avoir plus de sevrés que de nés vivants.'
            : 'Il ne peut pas y avoir plus de vivants que de nés vivants.'}
        </p>
      )}
    </div>
  );
}
