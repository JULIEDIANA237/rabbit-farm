'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, Card, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select } from '@/components/ui/kit';
import { toInt, useForm } from '@/hooks/use-form';
import { clean, cleanEdit } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
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
const UPDATE_SECTION = gql`
  mutation UpdateSection($input: UpdateSectionInput!) { updateSection(input: $input) { id } }
`;
const DELETE_SECTION = gql`
  mutation DeleteSection($id: ID!) { deleteSection(id: $id) { id } }
`;
const DELETE_CAGE = gql`
  mutation DeleteCage($id: ID!) { deleteCage(id: $id) { id } }
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
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingCage, setEditingCage] = useState<Cage | null>(null);
  const [updateCage] = useMutation(UPDATE_CAGE, { refetchQueries });
  const removeCage = useDeleteAction(DELETE_CAGE, { refetchQueries });
  const removeSection = useDeleteAction(DELETE_SECTION, { refetchQueries });

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
            <RowActions
              onEdit={() => setEditingSection(section)}
              onDelete={() =>
                removeSection.ask(
                  section.id,
                  `la section ${section.name}`,
                  section.cageCount > 0 ? 'Une section ne peut être supprimée qu’une fois toutes ses cages supprimées.' : undefined,
                )
              }
            >
              <Button variant="secondary" onClick={() => setModal({ sectionId: section.id })}>
                <Plus size={14} /> Cage
              </Button>
            </RowActions>
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
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <strong className="break-words">{c.code}</strong>
                        {c.status !== 'ACTIVE' && (
                          <div className="mt-0.5">
                            <Badge>{label(CAGE_STATUS, c.status)}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="-mr-2 -mt-2 shrink-0">
                        <RowActions
                          onEdit={() => setEditingCage(c)}
                          onDelete={() =>
                            removeCage.ask(
                              c.id,
                              `la cage ${c.code}`,
                              c.rabbitCount > 0
                                ? `Cette cage contient ${c.rabbitCount} lapin(s) : déplacez-les d’abord.`
                                : 'Une cage qui a déjà accueilli des lapins ne peut pas être supprimée (leur historique serait perdu) : passez-la plutôt en « Inactive ».',
                            )
                          }
                        />
                      </div>
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
      {editingSection && <SectionModal key={editingSection.id} editing={editingSection} onClose={() => setEditingSection(null)} />}
      {editingCage && (
        <CageModal
          key={editingCage.id}
          sectionId={editingCage.sectionId}
          editing={editingCage}
          sections={data?.sections ?? []}
          onClose={() => setEditingCage(null)}
        />
      )}
      {removeCage.dialog}
      {removeSection.dialog}
    </div>
  );
}

function SectionModal({ onClose, editing }: { onClose: () => void; editing?: Section }) {
  const { bind, values } = useForm({
    name: editing?.name ?? '',
    type: editing?.type ?? 'MATERNITY',
    description: editing?.description ?? '',
  });
  const [create, createState] = useMutation(CREATE_SECTION, { refetchQueries });
  const [update, updateState] = useMutation(UPDATE_SECTION, { refetchQueries });
  const { loading, error } = editing ? updateState : createState;
  const submit = () =>
    (editing
      ? update({ variables: { input: { id: editing.id, ...cleanEdit(values, ['description']) } } })
      : create({ variables: { input: clean(values) } })
    )
      .then(onClose)
      .catch(() => undefined);
  return (
    <Modal
      open
      title={editing ? 'Modifier la section' : 'Nouvelle section'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button loading={loading} disabled={!values.name} onClick={submit}>
            {editing ? 'Enregistrer' : 'Créer'}
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

function CageModal({
  sectionId,
  onClose,
  editing,
  sections = [],
}: {
  sectionId: string;
  onClose: () => void;
  editing?: Cage;
  sections?: Section[];
}) {
  const { bind, values } = useForm({
    code: editing?.code ?? '',
    capacity: editing ? String(editing.capacity) : '1',
    type: editing?.type ?? '',
    sectionId,
    status: editing?.status ?? 'ACTIVE',
  });
  const [create, createState] = useMutation(CREATE_CAGE, { refetchQueries });
  const [update, updateState] = useMutation(UPDATE_CAGE, { refetchQueries });
  const { loading, error } = editing ? updateState : createState;
  const capacity = toInt(values.capacity) ?? 1;
  const submit = () =>
    (editing
      ? update({
          variables: {
            input: {
              id: editing.id,
              ...cleanEdit(
                { code: values.code, capacity, type: values.type, sectionId: values.sectionId, status: values.status },
                ['type'],
              ),
            },
          },
        })
      : create({ variables: { input: clean({ sectionId, code: values.code, capacity, type: values.type }) } })
    )
      .then(onClose)
      .catch(() => undefined);
  return (
    <Modal
      open
      title={editing ? `Modifier la cage ${editing.code}` : 'Nouvelle cage'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button loading={loading} disabled={!values.code} onClick={submit}>
            {editing ? 'Enregistrer' : 'Créer'}
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
        {editing && (
          <>
            <Field label="Section">
              <Select options={sections.map((s) => ({ value: s.id, label: s.name }))} {...bind('sectionId')} />
            </Field>
            <Field label="Statut">
              <Select options={options(CAGE_STATUS)} {...bind('status')} />
            </Field>
          </>
        )}
      </FormGrid>
      {editing && editing.rabbitCount > 0 && (
        <p className="text-xs text-slate-500">
          {editing.rabbitCount} lapin(s) dans cette cage : la capacité ne peut pas descendre en dessous.
        </p>
      )}
      <ErrorBox error={error} />
    </Modal>
  );
}
