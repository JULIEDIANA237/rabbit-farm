'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Camera, CheckCircle2, ImagePlus, Trash2 } from 'lucide-react';

import { Button, Card, ErrorBox, Input, PageHeader, Select } from '@/components/ui/kit';
import { getAccessToken } from '@/lib/auth-storage';
import { compressImage } from '@/lib/image-compress';
import { FARM_SETUP } from '@/lib/setup';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface RabbitRow {
  id: number;
  code: string;
  sex: string;
  birthDate: string;
  breed: string;
  color: string;
  note: string;
  exists: boolean;
  keep: boolean;
}

interface BreedingRow {
  id: number;
  femaleCode: string;
  maleCode: string;
  date: string;
  note: string;
  keep: boolean;
}

interface Reading {
  rabbits: Array<{ code: string; sex: string; birthDate?: string | null; breed?: string | null; color?: string | null; note?: string | null; exists: boolean }>;
  breedings: Array<{ femaleCode: string; maleCode: string; date?: string | null; note?: string | null }>;
  warnings: string[];
}

const IMPORT_NOTEBOOK = gql`
  mutation ImportNotebook($input: ImportNotebookInput!) {
    importNotebook(input: $input) { rabbits breedings errors }
  }
`;

const SEX_OPTIONS = [
  { value: 'FEMALE', label: 'Femelle' },
  { value: 'MALE', label: 'Mâle' },
  { value: 'UNKNOWN', label: 'Inconnu' },
];

let nextId = 1;

async function readPhoto(file: File): Promise<Reading> {
  const photo = await compressImage(file, 2000, 0.85);
  const body = new FormData();
  body.append('photo', photo);
  const res = await fetch(`${API_URL}/assistant/notebook`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
    body,
  });
  const json = (await res.json().catch(() => ({}))) as Reading & { message?: string | string[] };
  if (!res.ok) {
    const message = Array.isArray(json.message) ? json.message.join(' ') : json.message;
    throw new Error(message || 'La lecture de la photo a échoué. Réessaie avec une photo plus nette.');
  }
  return json;
}

export default function ImportNotebookPage() {
  const input = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [photos, setPhotos] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [rabbits, setRabbits] = useState<RabbitRow[]>([]);
  const [breedings, setBreedings] = useState<BreedingRow[]>([]);
  const [save, saving] = useMutation<{ importNotebook: { rabbits: number; breedings: number; errors: string[] } }>(IMPORT_NOTEBOOK, {
    refetchQueries: [{ query: FARM_SETUP }],
  });
  const result = saving.data?.importNotebook;

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    setError(null);
    try {
      const r = await readPhoto(file);
      setPhotos((n) => n + 1);
      setWarnings((w) => [...w, ...r.warnings]);
      setRabbits((rows) => {
        const seen = new Set(rows.map((row) => row.code.toLowerCase()));
        const added = r.rabbits
          .filter((x) => !seen.has(x.code.toLowerCase()))
          .map((x) => ({
            id: nextId++, code: x.code, sex: x.sex, birthDate: x.birthDate ?? '', breed: x.breed ?? '', color: x.color ?? '',
            note: x.note ?? '', exists: x.exists, keep: !x.exists,
          }));
        return [...rows, ...added];
      });
      setBreedings((rows) => [
        ...rows,
        ...r.breedings.map((b) => ({ id: nextId++, femaleCode: b.femaleCode, maleCode: b.maleCode, date: b.date ?? '', note: b.note ?? '', keep: true })),
      ]);
    } catch (e) {
      setError(e);
    } finally {
      setReading(false);
      if (input.current) input.current.value = '';
    }
  };

  const setRabbit = (id: number, patch: Partial<RabbitRow>) => setRabbits((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const setBreeding = (id: number, patch: Partial<BreedingRow>) => setBreedings((rows) => rows.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const keptRabbits = rabbits.filter((r) => r.keep && r.code.trim());
  const keptBreedings = breedings.filter((b) => b.keep);
  const missingDate = keptBreedings.some((b) => !b.date);

  const submit = () =>
    save({
      variables: {
        input: {
          rabbits: keptRabbits.map((r) => ({
            code: r.code.trim(), sex: r.sex, birthDate: r.birthDate || null, breed: r.breed || null, color: r.color || null, note: r.note || null,
          })),
          breedings: keptBreedings.map((b) => ({ femaleCode: b.femaleCode.trim(), maleCode: b.maleCode.trim(), date: b.date, note: b.note || null })),
        },
      },
    }).catch(() => undefined);

  if (result) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow="Photo du cahier" title="C’est enregistré" />
        <Card>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-slate-900">
                {result.rabbits} lapin{result.rabbits > 1 ? 's' : ''} et {result.breedings} saillie{result.breedings > 1 ? 's' : ''} ajoutés.
              </p>
              {result.breedings > 0 && <p className="text-slate-600">Les palpations, nids et mises bas à venir sont dans tes tâches.</p>}
              {result.errors.map((e) => (
                <p key={e} className="text-amber-700">⚠️ {e}</p>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/rabbits" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Voir mes lapins</Link>
            <Link href="/tasks" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">Voir mes tâches</Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">Tableau de bord</Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Démarrage rapide"
        title="Photo du cahier"
        description="Photographie une page de ton cahier d’élevage : l’assistant lit tes lapins et tes saillies. Tu corriges, puis tu enregistres tout d’un coup."
      />

      <Card>
        <input
          ref={input}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void onPhoto(e.target.files?.[0])}
        />
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button onClick={() => input.current?.click()} loading={reading} disabled={reading}>
            {photos === 0 ? <Camera size={16} /> : <ImagePlus size={16} />}
            {reading ? 'Lecture en cours…' : photos === 0 ? 'Prendre la photo' : 'Ajouter une autre page'}
          </Button>
          <p className="text-sm text-slate-500">
            {reading ? 'Ça prend en général 10 à 30 secondes.' : 'Une page à la fois, bien éclairée, à plat.'}
          </p>
        </div>
        {error ? <div className="mt-3"><ErrorBox error={error} /></div> : null}
        {warnings.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-amber-700">
            {warnings.map((w, i) => <li key={i}>⚠️ {w}</li>)}
          </ul>
        )}
      </Card>

      {rabbits.length > 0 && (
        <Card title={`Lapins lus (${keptRabbits.length} à ajouter)`} subtitle="Décoche ceux à ne pas ajouter. Ceux déjà dans ta ferme sont décochés.">
          <div className="space-y-2">
            {rabbits.map((r) => (
              <div key={r.id} className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border p-2 sm:grid-cols-[auto_8rem_9rem_10rem_1fr_auto] ${r.keep ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                <input type="checkbox" checked={r.keep} onChange={(e) => setRabbit(r.id, { keep: e.target.checked })} aria-label={`Ajouter ${r.code}`} className="h-5 w-5" />
                <Input value={r.code} onChange={(e) => setRabbit(r.id, { code: e.target.value })} aria-label="Code" />
                <button type="button" onClick={() => setRabbits((rows) => rows.filter((x) => x.id !== r.id))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 sm:order-last" aria-label="Retirer">
                  <Trash2 size={16} />
                </button>
                <div className="col-span-3 grid grid-cols-2 gap-2 sm:col-span-1 sm:contents">
                  <Select value={r.sex} options={SEX_OPTIONS} onChange={(e) => setRabbit(r.id, { sex: e.target.value })} aria-label="Sexe" />
                  <Input type="date" value={r.birthDate} onChange={(e) => setRabbit(r.id, { birthDate: e.target.value })} aria-label="Date de naissance" />
                  <Input value={r.breed} placeholder="Race" onChange={(e) => setRabbit(r.id, { breed: e.target.value })} aria-label="Race" className="col-span-2 sm:col-span-1" />
                </div>
                {r.exists && <p className="col-span-3 text-xs text-slate-500 sm:col-span-6">Déjà dans ta ferme.</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {breedings.length > 0 && (
        <Card title={`Saillies lues (${keptBreedings.length})`} subtitle="L’app calculera la palpation, le nid et la mise bas de chacune.">
          <div className="space-y-2">
            {breedings.map((b) => (
              <div key={b.id} className={`grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-xl border p-2 sm:grid-cols-[auto_8rem_8rem_10rem_auto] ${b.keep ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                <input type="checkbox" checked={b.keep} onChange={(e) => setBreeding(b.id, { keep: e.target.checked })} aria-label="Ajouter cette saillie" className="h-5 w-5" />
                <Input value={b.femaleCode} onChange={(e) => setBreeding(b.id, { femaleCode: e.target.value })} aria-label="Femelle" placeholder="Femelle" />
                <Input value={b.maleCode} onChange={(e) => setBreeding(b.id, { maleCode: e.target.value })} aria-label="Mâle" placeholder="Mâle" />
                <button type="button" onClick={() => setBreedings((rows) => rows.filter((x) => x.id !== b.id))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 sm:order-last" aria-label="Retirer">
                  <Trash2 size={16} />
                </button>
                <Input type="date" value={b.date} onChange={(e) => setBreeding(b.id, { date: e.target.value })} aria-label="Date" className={`col-span-4 sm:col-span-1 ${b.keep && !b.date ? 'border-amber-400' : ''}`} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {(rabbits.length > 0 || breedings.length > 0) && (
        <div className="sticky bottom-20 z-10 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg sm:bottom-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {missingDate ? 'Ajoute la date des saillies en orange avant d’enregistrer.' : `${keptRabbits.length} lapin(s) et ${keptBreedings.length} saillie(s) seront ajoutés.`}
          </p>
          <Button onClick={() => void submit()} loading={saving.loading} disabled={saving.loading || missingDate || (keptRabbits.length === 0 && keptBreedings.length === 0)}>
            Tout enregistrer
          </Button>
        </div>
      )}
      {saving.error ? <ErrorBox error={saving.error} /> : null}
    </div>
  );
}
