'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { Badge, Button, Card, ErrorBox, Grid, Loading, PageHeader, Stat, Table, Tabs } from '@/components/ui/kit';
import { formatDate, formatPercent } from '@/lib/format';
import { LITTER_STATUS, label } from '@/lib/labels';

const LITTERS = gql`
  query Litters {
    litters {
      id
      code
      status
      birthDate
      liveBorn
      stillBorn
      currentCount
      kitCount
      mother { id code }
      father { id code }
    }
    births {
      id
      birthDate
      liveBorn
      stillBorn
      litterId
      litterCode
      mother { id code }
      father { id code }
    }
  }
`;

interface Litter {
  id: string;
  code: string;
  status: string;
  birthDate: string;
  liveBorn: number;
  stillBorn: number;
  currentCount: number;
  kitCount: number;
  mother?: { id: string; code: string } | null;
  father?: { id: string; code: string } | null;
}

interface Birth {
  id: string;
  birthDate: string;
  liveBorn: number;
  stillBorn: number;
  litterId?: string | null;
  litterCode?: string | null;
  mother?: { code: string } | null;
  father?: { code: string } | null;
}

const ageDays = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);

export default function BirthsPage() {
  const [tab, setTab] = useState<'litters' | 'births'>('litters');
  const { data, loading, error, refetch } = useQuery<{ litters: Litter[]; births: Birth[] }>(LITTERS);

  const litters = data?.litters ?? [];
  const births = data?.births ?? [];
  const active = litters.filter((l) => l.status === 'ACTIVE');
  const liveBorn = births.reduce((s, b) => s + b.liveBorn, 0);
  const stillBorn = births.reduce((s, b) => s + b.stillBorn, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Naissances"
        title="Portées et mises bas"
        description="Les mises bas s'enregistrent depuis la page Reproduction ; chaque portée a sa fiche."
        actions={
          <Link href="/breeding">
            <Button>Enregistrer une mise bas</Button>
          </Link>
        }
      />

      <div className="mb-6">
        <Grid>
          <Stat label="Portées sous la mère" value={active.length} tone="info" />
          <Stat label="Lapereaux sous la mère" value={active.reduce((s, l) => s + l.currentCount, 0)} />
          <Stat label="Nés vivants (total)" value={liveBorn} tone="success" />
          <Stat
            label="Mortinatalité"
            value={formatPercent(liveBorn + stillBorn ? (stillBorn / (liveBorn + stillBorn)) * 100 : null)}
            hint={`${stillBorn} mort-né${stillBorn > 1 ? 's' : ''} sur ${liveBorn + stillBorn} naissances`}
          />
        </Grid>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'litters', label: 'Portées' },
          { value: 'births', label: 'Mises bas' },
        ]}
      />

      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : tab === 'litters' ? (
        <Table
          rows={litters}
          empty="Aucune portée"
          columns={[
            { header: 'Portée', cell: (l) => <Link className="font-semibold text-emerald-700" href={`/litters/${l.id}`}>{l.code}</Link> },
            { header: 'Mère', cell: (l) => l.mother?.code ?? '—' },
            { header: 'Père', cell: (l) => l.father?.code ?? '—' },
            { header: 'Naissance', cell: (l) => `${formatDate(l.birthDate)} (${ageDays(l.birthDate)} j)` },
            { header: 'Vivants / mort-nés', cell: (l) => `${l.liveBorn} / ${l.stillBorn}` },
            { header: 'Effectif actuel', cell: (l) => l.currentCount },
            { header: 'Statut', cell: (l) => <Badge tone={l.status === 'ACTIVE' ? 'pink' : 'slate'}>{label(LITTER_STATUS, l.status)}</Badge> },
          ]}
        />
      ) : (
        <Card>
          <Table
            rows={births}
            empty="Aucune mise bas"
            columns={[
              { header: 'Date', cell: (b) => formatDate(b.birthDate) },
              { header: 'Mère', cell: (b) => b.mother?.code ?? '—' },
              { header: 'Père', cell: (b) => b.father?.code ?? '—' },
              { header: 'Vivants', cell: (b) => b.liveBorn },
              { header: 'Mort-nés', cell: (b) => b.stillBorn },
              {
                header: 'Portée',
                cell: (b) => (b.litterId ? <Link className="text-emerald-700" href={`/litters/${b.litterId}`}>{b.litterCode}</Link> : '—'),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
