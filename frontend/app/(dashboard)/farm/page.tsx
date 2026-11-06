'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, Card, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select } from '@/components/ui/kit';
import { toInt, useForm } from '@/hooks/use-form';
import { clean } from '@/lib/format';
import { CAGE_STATUS, SECTION_TYPE, label, options } from '@/lib/labels';

const FARM = gql`
  query FarmStructure {
    sections { id name type description cageCount }
    cages { id code type capacity rabbitCount status sectionId }
  }
`;
const CREATE_SECTION = gql`
  mutation CreateSection($input: CreateSectionInput!) { createSection(input: $input) { id } }
`;
const CREATE_CAGE = gql`
  mutation CreateCage($input: CreateCageInput!) { createCage(input: $input) { id } }
`;
const UPDATE_CAGE = gql`
  mutation UpdateCage($input: UpdateCageInput!) { updateCage(input: $input) { id status } }
`;

interface Section {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  cageCount: number;
}
interface Cage {
  id: string;
  code: string;
  type?: string | null;
  capacity: number;
  rabbitCount: number;
  status: string;
  sectionId: string;
}

const refetchQueries = ['FarmStructure', 'CageOptions'];

export default function FarmPage() {
  const { data, loading, error, refetch } = useQuery<{ sections: Section[]; cages: Cage[] }>(FARM);
  const [modal, setModal] = useState<'section' | { sectionId: string } | null>(null);
  const [updateCage] = useMutation(UPDATE_CAGE, { refetchQueries });

  if (loading && !data) return <Loading />;

  const cages = data?.cages ?? [];
  const totalCapacity = cages.reduce((s, c) => s + c.capacity, 0);
  const totalRabbits = cages.reduce((s, c) => s + c.rabbitCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ferme"
        title="Bâtiments et cages"
        description={`${cages.length} cages · ${totalRabbits}/${totalCapacity} places occupées`}
        actions={
          <Button onClick={() => setModal('section')}>
            <Plus size={16} /> Nouvelle section
          </Button>
        }
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {(data?.sections ?? []).map((section) => (
        <Card
          key={section.id}
          title={section.name}
          subtitle={`${label(SECTION_TYPE, section.type)}${section.description ? ` · ${section.description}` : ''}`}
          actions={
            <Button variant="secondary" onClick={() => setModal({ sectionId: section.id })}>
              <Plus size={14} /> Cage
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {cages
              .filter((c) => c.sectionId === section.id)
              .map((c) => {
                const ratio = c.capacity ? c.rabbitCount / c.capacity : 0;
                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-3 text-sm ${
                      c.status !== 'ACTIVE'
                        ? 'border-slate-200 bg-slate-100 text-slate-500'
                        : ratio > 1
                          ? 'border-red-200 bg-red-50'
                          : ratio === 1
                            ? 'border-amber-200 bg-amber-50'
                            : c.rabbitCount === 0
                              ? 'border-slate-200 bg-white'
                              : 'border-emerald-200 bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong>{c.code}</strong>
                      {c.status !== 'ACTIVE' && <Badge>{label(CAGE_STATUS, c.status)}</Badge>}
                    </div>
                    <p className="mt-1 text-slate-600">
                      {c.rabbitCount}/{c.capacity} lapin(s)
                    </p>
                    {c.type && <p className="text-xs text-slate-500">{c.type}</p>}
                    <select
                      aria-label={`Statut de la cage ${c.code}`}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-1 py-0.5 text-xs"
                      value={c.status}
                      onChange={(e) => updateCage({ variables: { input: { id: c.id, status: e.target.value } } }).catch((err) => window.alert(err.message))}
                    >
                      {options(CAGE_STATUS).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            {section.cageCount === 0 && <p className="col-span-full text-sm text-slate-500">Aucune cage dans cette section.</p>}
          </div>
        </Card>
      ))}
      {data?.sections.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500">Commencez par créer une section (maternité, engraissement…), puis ajoutez-y des cages.</p>
        </Card>
      )}

      {modal === 'section' && <SectionModal onClose={() => setModal(null)} />}
      {modal && modal !== 'section' && <CageModal sectionId={modal.sectionId} onClose={() => setModal(null)} />}
    </div>
  );
}

function SectionModal({ onClose }: { onClose: () => void }) {
  const { bind, values } = useForm({ name: '', type: 'MATERNITY', description: '' });
  const [create, { loading, error }] = useMutation(CREATE_SECTION, { refetchQueries });
  return (
    <Modal
      open
      title="Nouvelle section"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button loading={loading} disabled={!values.name} onClick={() => create({ variables: { input: clean(values) } }).then(onClose).catch(() => undefined)}>
            Créer
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Nom">
          <Input placeholder="Bâtiment A" {...bind('name')} />
        </Field>
        <Field label="Type">
          <Select options={options(SECTION_TYPE)} {...bind('type')} />
        </Field>
      </FormGrid>
      <Field label="Description">
        <Input {...bind('description')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

function CageModal({ sectionId, onClose }: { sectionId: string; onClose: () => void }) {
  const { bind, values } = useForm({ code: '', capacity: '1', type: '' });
  const [create, { loading, error }] = useMutation(CREATE_CAGE, { refetchQueries });
  return (
    <Modal
      open
      title="Nouvelle cage"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.code}
            onClick={() =>
              create({ variables: { input: clean({ sectionId, code: values.code, capacity: toInt(values.capacity) ?? 1, type: values.type }) } })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            Créer
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Code">
          <Input placeholder="C01" {...bind('code')} />
        </Field>
        <Field label="Capacité">
          <Input type="number" min={1} {...bind('capacity')} />
        </Field>
        <Field label="Type">
          <Input placeholder="Maternité, engraissement…" {...bind('type')} />
        </Field>
      </FormGrid>
      <ErrorBox error={error} />
    </Modal>
  );
}
