'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { Trash2 } from 'lucide-react';

import {
  Badge, Button, Card, ErrorBox, Field, FormGrid, Input, Loading, PageHeader, Select, Table, Tabs, type BadgeTone,
} from '@/components/ui/kit';
import { PedigreeTree } from '@/components/genetics/pedigree-tree';
import { useBreedOptions, useRabbitOptions } from '@/graphql/options';
import { useForm } from '@/hooks/use-form';
import { clean } from '@/lib/format';
import { COMPATIBILITY, label } from '@/lib/labels';

const GENETICS = gql`
  query Genetics {
    breeds { id name description }
    crossBreeds { id name description parentBreedA { name } parentBreedB { name } }
  }
`;
const RISKY = gql`
  query RiskyPairs {
    riskyBreedingPairs(limit: 100) {
      femaleId
      maleId
      femaleCode
      maleCode
      level
      inbreedingCoefficient
      reasons { code message }
    }
  }
`;
const COMPAT = gql`
  query CheckCompatibility($femaleId: ID!, $maleId: ID!) {
    breedingCompatibility(femaleId: $femaleId, maleId: $maleId) {
      level
      inbreedingCoefficient
      reasons { code level message }
      commonAncestors { id code }
    }
  }
`;
const CREATE_BREED = gql`
  mutation CreateBreed($input: CreateBreedInput!) { createBreed(input: $input) { id } }
`;
const DELETE_BREED = gql`
  mutation DeleteBreed($id: ID!) { deleteBreed(id: $id) }
`;
const CREATE_CROSS = gql`
  mutation CreateCrossBreed($input: CreateCrossBreedInput!) { createCrossBreed(input: $input) { id } }
`;

const LEVEL_TONE: Record<string, BadgeTone> = { COMPATIBLE: 'green', WARNING: 'amber', BLOCKED: 'red' };

type Tab = 'breeds' | 'pedigree' | 'compat' | 'risky';

export default function GeneticsPage() {
  const [tab, setTab] = useState<Tab>('breeds');
  return (
    <div>
      <PageHeader eyebrow="Génétique" title="Races, généalogie et consanguinité" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'breeds', label: 'Races et croisements' },
          { value: 'pedigree', label: 'Pedigree' },
          { value: 'compat', label: 'Tester un accouplement' },
          { value: 'risky', label: 'Couples à risque' },
        ]}
      />
      {tab === 'breeds' && <BreedsTab />}
      {tab === 'pedigree' && <PedigreeTab />}
      {tab === 'compat' && <CompatibilityTab />}
      {tab === 'risky' && <RiskyTab />}
    </div>
  );
}

function BreedsTab() {
  const { data, loading, error } = useQuery<{
    breeds: Array<{ id: string; name: string; description?: string | null }>;
    crossBreeds: Array<{ id: string; name: string; parentBreedA: { name: string }; parentBreedB: { name: string } }>;
  }>(GENETICS);
  const breeds = useBreedOptions();
  const opts = { refetchQueries: ['Genetics', 'BreedOptions'] };
  const [createBreed, cb] = useMutation(CREATE_BREED, opts);
  const [deleteBreed] = useMutation(DELETE_BREED, opts);
  const [createCross, cc] = useMutation(CREATE_CROSS, opts);
  const breedForm = useForm({ name: '', description: '' });
  const crossForm = useForm({ name: '', parentBreedAId: '', parentBreedBId: '' });

  if (loading && !data) return <Loading />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Races">
        <ErrorBox error={error} />
        <ul className="mb-4 space-y-2">
          {(data?.breeds ?? []).map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
              <span>
                <strong>{b.name}</strong> {b.description && <span className="text-slate-500">· {b.description}</span>}
              </span>
              <button
                type="button"
                aria-label={`Supprimer ${b.name}`}
                className="text-slate-400 hover:text-red-600"
                onClick={() => window.confirm(`Supprimer la race ${b.name} ?`) && deleteBreed({ variables: { id: b.id } }).catch((e) => window.alert(e.message))}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
        <FormGrid>
          <Field label="Nouvelle race">
            <Input placeholder="Néo-zélandais, Californien…" {...breedForm.bind('name')} />
          </Field>
          <Field label="Description">
            <Input {...breedForm.bind('description')} />
          </Field>
        </FormGrid>
        <Button
          className="mt-3"
          loading={cb.loading}
          disabled={!breedForm.values.name}
          onClick={() => createBreed({ variables: { input: clean(breedForm.values) } }).then(breedForm.reset).catch(() => undefined)}
        >
          Ajouter la race
        </Button>
        <ErrorBox error={cb.error} />
      </Card>

      <Card title="Croisements">
        <ul className="mb-4 space-y-2">
          {(data?.crossBreeds ?? []).map((c) => (
            <li key={c.id} className="rounded-xl bg-slate-50 p-3 text-sm">
              <strong>{c.name}</strong> · {c.parentBreedA.name} × {c.parentBreedB.name}
            </li>
          ))}
          {data?.crossBreeds.length === 0 && <li className="text-sm text-slate-500">Aucun croisement.</li>}
        </ul>
        <FormGrid>
          <Field label="Nom du croisement">
            <Input {...crossForm.bind('name')} />
          </Field>
          <div />
          <Field label="Race A">
            <Select placeholder="Choisir…" options={breeds.options} {...crossForm.bind('parentBreedAId')} />
          </Field>
          <Field label="Race B">
            <Select placeholder="Choisir…" options={breeds.options} {...crossForm.bind('parentBreedBId')} />
          </Field>
        </FormGrid>
        <Button
          className="mt-3"
          loading={cc.loading}
          disabled={!crossForm.values.name || !crossForm.values.parentBreedAId || !crossForm.values.parentBreedBId}
          onClick={() => createCross({ variables: { input: crossForm.values } }).then(crossForm.reset).catch(() => undefined)}
        >
          Ajouter le croisement
        </Button>
        <ErrorBox error={cc.error} />
      </Card>
    </div>
  );
}

function PedigreeTab() {
  const rabbits = useRabbitOptions({ status: undefined });
  const [rabbitId, setRabbitId] = useState('');
  return (
    <Card title="Arbre généalogique (3 générations)">
      <div className="mb-4 max-w-sm">
        <Select placeholder="Choisir un lapin…" options={rabbits.options} value={rabbitId} onChange={(e) => setRabbitId(e.target.value)} />
      </div>
      {rabbitId && <PedigreeTree rabbitId={rabbitId} />}
    </Card>
  );
}

function CompatibilityTab() {
  const females = useRabbitOptions({ sex: 'FEMALE' });
  const males = useRabbitOptions({ sex: 'MALE' });
  const { bind, values } = useForm({ femaleId: '', maleId: '' });
  const [check, { data, loading, error }] = useLazyQuery<{
    breedingCompatibility: {
      level: string;
      inbreedingCoefficient: number;
      reasons: Array<{ code: string; message: string }>;
      commonAncestors: Array<{ code: string }>;
    };
  }>(COMPAT, { fetchPolicy: 'network-only' });
  const r = data?.breedingCompatibility;
  return (
    <Card title="Tester un accouplement">
      <FormGrid>
        <Field label="Femelle">
          <Select placeholder="Choisir…" options={females.options} {...bind('femaleId')} />
        </Field>
        <Field label="Mâle">
          <Select placeholder="Choisir…" options={males.options} {...bind('maleId')} />
        </Field>
      </FormGrid>
      <Button className="mt-3" loading={loading} disabled={!values.femaleId || !values.maleId} onClick={() => check({ variables: values })}>
        Vérifier
      </Button>
      <ErrorBox error={error} />
      {r && (
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <Badge tone={LEVEL_TONE[r.level]}>{label(COMPATIBILITY, r.level)}</Badge>{' '}
            Coefficient de consanguinité de la descendance : <strong>{(r.inbreedingCoefficient * 100).toFixed(2)} %</strong>
          </p>
          {r.reasons.map((x) => (
            <p key={x.code}>• {x.message}</p>
          ))}
          {r.commonAncestors.length > 0 && <p className="text-slate-500">Ancêtres communs : {r.commonAncestors.map((a) => a.code).join(', ')}</p>}
        </div>
      )}
    </Card>
  );
}

function RiskyTab() {
  const { data, loading, error } = useQuery<{
    riskyBreedingPairs: Array<{ femaleId: string; maleId: string; femaleCode: string; maleCode: string; level: string; inbreedingCoefficient: number; reasons: Array<{ message: string }> }>;
  }>(RISKY, { fetchPolicy: 'cache-and-network' });
  if (loading && !data) return <Loading />;
  return (
    <>
      <ErrorBox error={error} />
      <Table
        rows={(data?.riskyBreedingPairs ?? []).map((p) => ({ ...p, id: `${p.femaleId}-${p.maleId}` }))}
        empty="Aucun couple à risque parmi les reproducteurs actifs"
        columns={[
          { header: 'Femelle', cell: (p) => <strong>{p.femaleCode}</strong> },
          { header: 'Mâle', cell: (p) => <strong>{p.maleCode}</strong> },
          { header: 'Niveau', cell: (p) => <Badge tone={LEVEL_TONE[p.level]}>{label(COMPATIBILITY, p.level)}</Badge> },
          { header: 'Consanguinité', cell: (p) => `${(p.inbreedingCoefficient * 100).toFixed(2)} %` },
          { header: 'Motif', cell: (p) => <span className="whitespace-normal">{p.reasons.map((r) => r.message).join(' · ')}</span> },
        ]}
      />
    </>
  );
}
