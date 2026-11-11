'use client';

import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { Button, Card, ErrorBox, Field, FormGrid, Input, Loading, PageHeader, Select, Table, Textarea } from '@/components/ui/kit';
import { ME_QUERY, type Me } from '@/graphql/auth/mutations';
import { useForm } from '@/hooks/use-form';
import { NotificationsCard } from '@/components/settings/notifications-card';
import { FARM_ROLE, INBREEDING_POLICY, label, options } from '@/lib/labels';

const UPDATE_FARM = gql`
  mutation UpdateFarm($input: UpdateFarmInput!) { updateFarm(input: $input) { id name location description inbreedingPolicy } }
`;
const MEMBERS = gql`
  query FarmMembers {
    farmMembers { id role user { id email firstName lastName isActive } }
  }
`;
const ADD_MEMBER = gql`
  mutation AddFarmMember($input: AddMemberInput!) { addFarmMember(input: $input) { id } }
`;
const UPDATE_ROLE = gql`
  mutation UpdateFarmMemberRole($input: UpdateMemberRoleInput!) { updateFarmMemberRole(input: $input) { id role } }
`;
const REMOVE_MEMBER = gql`
  mutation RemoveFarmMember($membershipId: ID!) { removeFarmMember(membershipId: $membershipId) { id } }
`;

interface Member {
  id: string;
  role: string;
  user: { id: string; email: string; firstName: string; lastName: string };
}

export default function SettingsPage() {
  const { data, loading, error } = useQuery<{ me: Me }>(ME_QUERY);
  const isAdmin = data?.me.role === 'ADMIN';

  if (loading && !data) return <Loading />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Paramètres" title="Ferme et équipe" />
      <ErrorBox error={error} />
      {data && <FarmSettings me={data.me} canEdit={isAdmin} />}
      {data && <MembersCard me={data.me} canEdit={isAdmin} />}
      <NotificationsCard />
    </div>
  );
}

function FarmSettings({ me, canEdit }: { me: Me; canEdit: boolean }) {
  const { bind, values, setValues } = useForm({
    name: me.farm.name,
    location: me.farm.location ?? '',
    description: me.farm.description ?? '',
    inbreedingPolicy: me.farm.inbreedingPolicy as string,
  });
  const [saved, setSaved] = useState(false);
  const [update, { loading, error }] = useMutation(UPDATE_FARM, { refetchQueries: ['Me'] });

  useEffect(() => {
    setValues({
      name: me.farm.name,
      location: me.farm.location ?? '',
      description: me.farm.description ?? '',
      inbreedingPolicy: me.farm.inbreedingPolicy,
    });
  }, [me, setValues]);

  return (
    <Card title="Élevage" subtitle={canEdit ? undefined : 'Seul un administrateur peut modifier ces informations.'}>
      <FormGrid>
        <Field label="Nom">
          <Input disabled={!canEdit} {...bind('name')} />
        </Field>
        <Field label="Localisation">
          <Input disabled={!canEdit} {...bind('location')} />
        </Field>
        <Field
          label="Politique de consanguinité"
          hint="Avertir : les croisements à risque (demi-frères/sœurs, ancêtre commun) demandent une confirmation. Bloquer : ils sont refusés. Parent × enfant et frère × sœur sont toujours interdits."
        >
          <Select disabled={!canEdit} options={options(INBREEDING_POLICY)} {...bind('inbreedingPolicy')} />
        </Field>
      </FormGrid>
      <Field label="Description" className="mt-4">
        <Textarea disabled={!canEdit} {...bind('description')} />
      </Field>
      {canEdit && (
        <div className="mt-4 flex items-center gap-3">
          <Button
            loading={loading}
            onClick={() =>
              update({ variables: { input: values } })
                .then(() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2500);
                })
                .catch(() => undefined)
            }
          >
            Enregistrer
          </Button>
          {saved && <span className="text-sm text-emerald-700">Enregistré ✓</span>}
        </div>
      )}
      <ErrorBox error={error} />
    </Card>
  );
}

function MembersCard({ me, canEdit }: { me: Me; canEdit: boolean }) {
  const { data, error } = useQuery<{ farmMembers: Member[] }>(MEMBERS, { skip: !canEdit });
  const opts = { refetchQueries: ['FarmMembers'] };
  const [add, a] = useMutation(ADD_MEMBER, opts);
  const [updateRole] = useMutation(UPDATE_ROLE, opts);
  const [remove] = useMutation(REMOVE_MEMBER, opts);
  const form = useForm({ email: '', role: 'EMPLOYEE' });

  if (!canEdit) {
    return (
      <Card title="Mon rôle">
        <p className="text-sm">
          {me.firstName} {me.lastName} · {label(FARM_ROLE, me.role)}
        </p>
      </Card>
    );
  }

  return (
    <Card title="Équipe" subtitle="Le membre doit déjà avoir un compte Rabbit Farm.">
      <ErrorBox error={error} />
      <Table
        rows={data?.farmMembers ?? []}
        columns={[
          { header: 'Nom', cell: (m) => `${m.user.firstName} ${m.user.lastName}` },
          { header: 'Email', cell: (m) => m.user.email },
          {
            header: 'Rôle',
            cell: (m) => (
              <Select
                aria-label={`Rôle de ${m.user.email}`}
                options={options(FARM_ROLE)}
                value={m.role}
                disabled={m.user.id === me.userId}
                onChange={(e) => updateRole({ variables: { input: { membershipId: m.id, role: e.target.value } } }).catch((err) => window.alert(err.message))}
              />
            ),
          },
          {
            header: '',
            cell: (m) =>
              m.user.id !== me.userId && (
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs text-red-600"
                  onClick={() => window.confirm(`Retirer ${m.user.email} de la ferme ?`) && remove({ variables: { membershipId: m.id } }).catch((err) => window.alert(err.message))}
                >
                  Retirer
                </Button>
              ),
          },
        ]}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_200px_auto] sm:items-end">
        <Field label="Email du membre">
          <Input type="email" {...form.bind('email')} />
        </Field>
        <Field label="Rôle">
          <Select options={options(FARM_ROLE)} {...form.bind('role')} />
        </Field>
        <Button loading={a.loading} disabled={!form.values.email} onClick={() => add({ variables: { input: form.values } }).then(form.reset).catch(() => undefined)}>
          Ajouter
        </Button>
      </div>
      <ErrorBox error={a.error} />
    </Card>
  );
}
