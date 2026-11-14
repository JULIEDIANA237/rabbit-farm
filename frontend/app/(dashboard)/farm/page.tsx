'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';

import { Badge, Button, Card, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select } from '@/components/ui/kit';
import { toInt, useForm } from '@/hooks/use-form';
import { clean, cleanEdit, fromDateInput, toDateInput } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { CAGE_STATUS, SEX, SECTION_TYPE, label, options } from '@/lib/labels';

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

/** Une couleur par bloc (classes écrites en entier pour que Tailwind les garde). */
const BLOC_COLORS = [
  { top: 'border-t-emerald-500', dot: 'bg-emerald-500', card: 'border-emerald-200 border-l-emerald-500 bg-emerald-50', text: 'text-emerald-800' },
  { top: 'border-t-sky-500', dot: 'bg-sky-500', card: 'border-sky-200 border-l-sky-500 bg-sky-50', text: 'text-sky-800' },
  { top: 'border-t-amber-500', dot: 'bg-amber-500', card: 'border-amber-200 border-l-amber-500 bg-amber-50', text: 'text-amber-800' },
  { top: 'border-t-violet-500', dot: 'bg-violet-500', card: 'border-violet-200 border-l-violet-500 bg-violet-50', text: 'text-violet-800' },
  { top: 'border-t-rose-500', dot: 'bg-rose-500', card: 'border-rose-200 border-l-rose-500 bg-rose-50', text: 'text-rose-800' },
  { top: 'border-t-teal-500', dot: 'bg-teal-500', card: 'border-teal-200 border-l-teal-500 bg-teal-50', text: 'text-teal-800' },
  { top: 'border-t-orange-500', dot: 'bg-orange-500', card: 'border-orange-200 border-l-orange-500 bg-orange-50', text: 'text-orange-800' },
  { top: 'border-t-indigo-500', dot: 'bg-indigo-500', card: 'border-indigo-200 border-l-indigo-500 bg-indigo-50', text: 'text-indigo-800' },
];

export default function FarmPage() {
  const { data, loading, error, refetch } = useQuery<{ sections: Section[]; cages: Cage[] }>(FARM);
  const [modal, setModal] = useState<'section' | { sectionId: string } | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingCage, setEditingCage] = useState<Cage | null>(null);
  const [occupants, setOccupants] = useState<Cage | null>(null);
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
        title="Cages"
        description={`${cages.length} cages · ${totalRabbits}/${totalCapacity} places occupées`}
        actions={
          <Button onClick={() => setModal('section')}>
            <Plus size={16} /> Nouveau bloc
          </Button>
        }
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {(data?.sections ?? []).map((section, index) => {
        const color = BLOC_COLORS[index % BLOC_COLORS.length];
        return (
          <Card
            key={section.id}
            className={`border-t-4 ${color.top}`}
            title={
              <span className="flex items-center gap-2">
                <span className={`h-3 w-3 shrink-0 rounded-full ${color.dot}`} aria-hidden />
                {section.name}
              </span>
            }
            subtitle={`${label(SECTION_TYPE, section.type)}${section.description ? ` · ${section.description}` : ''}`}
            actions={
              <RowActions
                onEdit={() => setEditingSection(section)}
                onDelete={() =>
                  removeSection.ask(
                    section.id,
                    `le bloc ${section.name}`,
                    section.cageCount > 0 ? 'Un bloc ne peut être supprimé qu’une fois toutes ses cages supprimées.' : undefined,
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
                  const inactive = c.status !== 'ACTIVE';
                  const ratio = c.capacity ? c.rabbitCount / c.capacity : 0;
                  return (
                    <div
                      key={c.id}
                      className={`rounded-2xl border border-l-4 p-3 text-sm ${
                        inactive ? 'border-slate-200 bg-slate-100 text-slate-500' : `${color.card}`
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <strong className={`break-words ${inactive ? '' : color.text}`}>{c.code}</strong>
                          {inactive && (
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
                      <p className="mt-1 text-slate-700">
                        <strong>{c.rabbitCount}</strong>/{c.capacity} lapin(s)
                        {ratio > 1 && <span className="ml-1 font-semibold text-red-600">· surchargée</span>}
                        {ratio === 1 && <span className="ml-1 font-semibold text-amber-700">· pleine</span>}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/80" aria-hidden>
                        <div
                          className={`h-full rounded-full ${ratio > 1 ? 'bg-red-500' : ratio === 1 ? 'bg-amber-500' : color.dot}`}
                          style={{ width: `${Math.min(100, ratio * 100)}%` }}
                        />
                      </div>
                      {c.type && <p className="mt-1 text-xs text-slate-500">{c.type}</p>}
                      <button
                        type="button"
                        onClick={() => setOccupants(c)}
                        className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Users size={14} /> Lapins
                      </button>
                    </div>
                  );
                })}
              {section.cageCount === 0 && <p className="col-span-full text-sm text-slate-500">Aucune cage dans ce bloc.</p>}
            </div>
          </Card>
        );
      })}
      {data?.sections.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500">Commencez par créer un bloc (maternité, engraissement…), puis ajoutez-y des cages.</p>
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
      {occupants && <CageRabbitsModal key={occupants.id} cage={occupants} onClose={() => setOccupants(null)} />}
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
      title={editing ? 'Modifier le bloc' : 'Nouveau bloc'}
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
          <Input placeholder="Bloc A" {...bind('name')} />
        </Field>
        <Field label="Usage">
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
            <Field label="Bloc">
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

const CAGE_RABBITS = gql`
  query CageRabbits($cageId: ID!) {
    rabbitsPaginated(input: { cageId: $cageId, status: ACTIVE, pageSize: 200 }) {
      total
      items { id code sex purpose }
    }
  }
`;
const RABBITS_TO_PLACE = gql`
  query RabbitsToPlace($search: String) {
    rabbitsPaginated(input: { search: $search, status: ACTIVE, pageSize: 50 }) {
      total
      items { id code sex purpose currentCageId currentCageCode }
    }
  }
`;
const MOVE_RABBIT = gql`
  mutation PlaceRabbit($input: MoveRabbitInput!) { moveRabbit(input: $input) { id } }
`;

interface PlacedRabbit {
  id: string;
  code: string;
  sex: string;
  purpose: string;
  currentCageId?: string | null;
  currentCageCode?: string | null;
}

/**
 * Lapins d'une cage : liste des occupants et ajout de lapins.
 * Le nombre de lapins d'une cage n'est pas saisi à la main : il est
 * calculé à partir des lapins qu'on y place (chacun garde son historique).
 */
function CageRabbitsModal({ cage, onClose }: { cage: Cage; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [date, setDate] = useState(toDateInput());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inside = useQuery<{ rabbitsPaginated: { total: number; items: PlacedRabbit[] } }>(CAGE_RABBITS, {
    variables: { cageId: cage.id },
    fetchPolicy: 'cache-and-network',
  });
  const candidates = useQuery<{ rabbitsPaginated: { total: number; items: PlacedRabbit[] } }>(RABBITS_TO_PLACE, {
    variables: { search: search.trim() || undefined },
    fetchPolicy: 'cache-and-network',
  });
  const [move] = useMutation(MOVE_RABBIT);
  const client = useApolloClient();

  const occupants = inside.data?.rabbitsPaginated.items ?? [];
  const free = Math.max(0, cage.capacity - cage.rabbitCount);
  const list = (candidates.data?.rabbitsPaginated.items ?? []).filter((r) => r.currentCageId !== cage.id);
  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < free ? [...cur, id] : cur));

  async function place() {
    setSaving(true);
    const failed: string[] = [];
    for (const rabbitId of selected) {
      try {
        // Aujourd'hui : l'heure actuelle (midi UTC pourrait être dans le futur).
        const movedAt = date === toDateInput() ? undefined : fromDateInput(date);
        await move({ variables: { input: { rabbitId, cageId: cage.id, movedAt } } });
      } catch (e) {
        const code = list.find((r) => r.id === rabbitId)?.code ?? rabbitId;
        failed.push(`${code} : ${e instanceof Error ? e.message : 'erreur'}`);
      }
    }
    await client.refetchQueries({ include: ['FarmStructure', 'CageOptions', 'CageRabbits', 'RabbitsToPlace', 'RabbitsPaginated', 'Dashboard'] });
    setSaving(false);
    setErrors(failed);
    if (failed.length === 0) onClose();
    else setSelected([]);
  }

  return (
    <Modal
      open
      title={`Cage ${cage.code} · ${cage.rabbitCount}/${cage.capacity} lapin(s)`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Fermer</Button>
          <Button loading={saving} disabled={selected.length === 0} onClick={() => void place()}>
            Placer {selected.length > 0 ? `${selected.length} lapin(s)` : ''}
          </Button>
        </>
      }
    >
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Dans la cage</p>
        {occupants.length === 0 ? (
          <p className="text-sm text-slate-500">{inside.loading ? 'Chargement…' : 'Aucun lapin enregistré dans cette cage.'}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {occupants.map((r) => (
              <Link
                key={r.id}
                href={`/rabbits/${r.id}`}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
              >
                {r.code} · {label(SEX, r.sex)}
              </Link>
            ))}
          </div>
        )}
        {cage.rabbitCount > occupants.length && (
          <p className="mt-2 text-xs text-slate-500">
            {cage.rabbitCount - occupants.length} autre(s) place(s) occupée(s) par un lot d’engraissement.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
          Ajouter des lapins · {free} place(s) libre(s)
        </p>
        {free === 0 ? (
          <p className="text-sm text-slate-600">La cage est pleine. Augmente sa capacité (crayon) ou libère une place.</p>
        ) : (
          <>
            <FormGrid>
              <Field label="Rechercher un lapin">
                <Input placeholder="Code du lapin" value={search} onChange={(e) => setSearch(e.target.value)} />
              </Field>
              <Field label="Date d’entrée dans la cage">
                <Input type="date" value={date} max={toDateInput()} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </FormGrid>
            <ul className="mt-3 max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
              {list.map((r) => {
                const checked = selected.includes(r.id);
                const disabled = !checked && selected.length >= free;
                return (
                  <li key={r.id}>
                    <label className={`flex items-center gap-3 px-3 py-2 text-sm ${disabled ? 'opacity-50' : 'cursor-pointer hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(r.id)} />
                      <span className="font-semibold">{r.code}</span>
                      <span className="text-slate-500">{label(SEX, r.sex)}</span>
                      <span className="ml-auto text-xs text-slate-500">
                        {r.currentCageCode ? `actuellement en ${r.currentCageCode}` : 'sans cage'}
                      </span>
                    </label>
                  </li>
                );
              })}
              {list.length === 0 && (
                <li className="px-3 py-2 text-sm text-slate-500">{candidates.loading ? 'Chargement…' : 'Aucun lapin trouvé.'}</li>
              )}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Un lapin déjà dans une autre cage y sera retiré et placé ici à la date choisie.
            </p>
          </>
        )}
        {errors.length > 0 && (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {errors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
