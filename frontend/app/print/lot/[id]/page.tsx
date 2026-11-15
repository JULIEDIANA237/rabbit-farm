'use client';

import { use, useRef } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PrintToolbar } from '@/components/print/print-toolbar';
import { ME_QUERY, type Me } from '@/graphql/auth/mutations';
import { formatDate, formatMoney, formatNumber } from '@/lib/format';
import { LOT_STATUS, label } from '@/lib/labels';

const SHEET = gql`
  query LotTrackingSheet($lotId: ID!) {
    lotTrackingSheet(lotId: $lotId) {
      lotId
      lotCode
      lotStatus
      entryDate
      exitDate
      currentCageCode
      enteredCount
      activeCount
      deadInLot
      soldCount
      soldWeight
      salesAmount
      overallDailyGainGrams
      litters {
        id
        code
        motherCode
        fatherCode
        breedingDate
        pregnancyConfirmedDate
        nestDate
        birthDate
        gestationDays
        liveBorn
        stillBorn
        weaningDate
        weaningAgeDays
        weaned
        weaningAverageWeight
        deathsBeforeWeaning
        events { date label }
      }
      weighings { date animalCount totalWeight averageWeight ageInDays dailyGainGrams }
      lotEvents { date label }
    }
  }
`;

interface SheetEvent {
  date: string;
  label: string;
}
interface Sheet {
  lotId: string;
  lotCode: string;
  lotStatus: string;
  entryDate: string;
  exitDate?: string | null;
  currentCageCode?: string | null;
  enteredCount: number;
  activeCount: number;
  deadInLot: number;
  soldCount: number;
  soldWeight?: number | null;
  salesAmount?: number | null;
  overallDailyGainGrams?: number | null;
  litters: Array<{
    id: string;
    code: string;
    motherCode?: string | null;
    fatherCode?: string | null;
    breedingDate?: string | null;
    pregnancyConfirmedDate?: string | null;
    nestDate?: string | null;
    birthDate: string;
    gestationDays?: number | null;
    liveBorn: number;
    stillBorn: number;
    weaningDate?: string | null;
    weaningAgeDays?: number | null;
    weaned: number;
    weaningAverageWeight?: number | null;
    deathsBeforeWeaning: number;
    events: SheetEvent[];
  }>;
  weighings: Array<{
    date: string;
    animalCount: number;
    totalWeight: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    dailyGainGrams?: number | null;
  }>;
  lotEvents: SheetEvent[];
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 py-1">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-medium">{v ?? '—'}</span>
    </div>
  );
}

function Timeline({ events }: { events: SheetEvent[] }) {
  return (
    <ol className="space-y-1 border-l-2 border-emerald-200 pl-4">
      {events.map((e, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="inline-block w-24 text-slate-500">{formatDate(e.date)}</span>
          {e.label}
        </li>
      ))}
    </ol>
  );
}

function TrackingSheet({ lotId }: { lotId: string }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useQuery<{ lotTrackingSheet: Sheet }>(SHEET, { variables: { lotId } });
  const { data: meData } = useQuery<{ me: Me }>(ME_QUERY);
  const s = data?.lotTrackingSheet;

  return (
    <div className="mx-auto max-w-3xl p-4 text-sm text-slate-800 sm:p-6">
      <PrintToolbar sheet={sheetRef} filename={s ? `fiche-suivi-${s.lotCode}` : undefined} fallbackHref={`/fattening/${lotId}`} />
      {loading && <p className="text-slate-500">Chargement…</p>}
      {(error || (!loading && !s)) && <p className="text-red-700">Lot introuvable.</p>}
      {s && (
        <div ref={sheetRef} className="space-y-6 bg-white p-4 sm:p-6">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xl font-bold text-emerald-700">{meData?.me.farm.name ?? 'RabbitFarm'}</p>
              <p className="text-slate-500">Fiche de suivi · de la saillie à l’engraissement</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">Lot {s.lotCode}</p>
              <p>{label(LOT_STATUS, s.lotStatus)}</p>
              <p className="text-slate-500">Édité le {formatDate(new Date().toISOString())}</p>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Entrés dans le lot', s.enteredCount],
              ['Présents', s.activeCount],
              ['Morts en engraissement', s.deadInLot],
              ['Vendus', s.soldCount],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="text-lg font-bold">{v}</p>
              </div>
            ))}
          </section>

          {s.litters.map((l) => {
            const survival = l.liveBorn ? Math.round(((l.liveBorn - l.deathsBeforeWeaning) / l.liveBorn) * 100) : null;
            return (
              <section key={l.id} className="space-y-3">
                <h2 className="text-base font-bold">
                  1. Naissance et sevrage · portée {l.code}
                </h2>
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div>
                    <Row k="Mère × père" v={`${l.motherCode ?? '?'} × ${l.fatherCode ?? '?'}`} />
                    <Row k="Saillie" v={l.breedingDate ? formatDate(l.breedingDate) : null} />
                    <Row k="Gestation confirmée" v={l.pregnancyConfirmedDate ? formatDate(l.pregnancyConfirmedDate) : null} />
                    <Row k="Nid posé" v={l.nestDate ? formatDate(l.nestDate) : null} />
                    <Row k="Mise bas" v={`${formatDate(l.birthDate)}${l.gestationDays != null ? ` (gestation ${l.gestationDays} j)` : ''}`} />
                  </div>
                  <div>
                    <Row k="Nés vivants / morts-nés" v={`${l.liveBorn} / ${l.stillBorn}`} />
                    <Row k="Morts avant sevrage" v={l.deathsBeforeWeaning} />
                    <Row k="Survie jusqu’au sevrage" v={survival != null ? `${survival} %` : null} />
                    <Row k="Sevrage" v={l.weaningDate ? `${formatDate(l.weaningDate)} (${l.weaningAgeDays} j)` : null} />
                    <Row
                      k="Sevrés · poids moyen"
                      v={`${l.weaned}${l.weaningAverageWeight != null ? ` · ${formatNumber(l.weaningAverageWeight, 3)} kg` : ''}`}
                    />
                  </div>
                </div>
                <Timeline events={l.events} />
              </section>
            );
          })}
          {s.litters.length === 0 && (
            <p className="text-slate-500">Les lapins de ce lot ne sont rattachés à aucune portée enregistrée.</p>
          )}

          <section className="space-y-3">
            <h2 className="text-base font-bold">2. Engraissement</h2>
            <div className="grid gap-x-8 sm:grid-cols-2">
              <div>
                <Row k="Entrée en lot" v={formatDate(s.entryDate)} />
                <Row k="Cage actuelle" v={s.currentCageCode} />
                {s.exitDate && <Row k="Fin du lot" v={formatDate(s.exitDate)} />}
              </div>
              <div>
                <Row k="GMQ global" v={s.overallDailyGainGrams != null ? `${s.overallDailyGainGrams} g/jour` : null} />
                <Row k="Poids vendu" v={s.soldWeight != null ? `${formatNumber(s.soldWeight, 2)} kg` : null} />
                <Row k="Montant des ventes" v={s.salesAmount != null ? formatMoney(s.salesAmount) : null} />
              </div>
            </div>
            {s.weighings.length > 0 && (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="py-1">Pesée</th>
                    <th className="py-1 text-right">Âge</th>
                    <th className="py-1 text-right">Lapins</th>
                    <th className="py-1 text-right">Total</th>
                    <th className="py-1 text-right">Moyen</th>
                    <th className="py-1 text-right">GMQ</th>
                  </tr>
                </thead>
                <tbody>
                  {s.weighings.map((w, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1">{formatDate(w.date)}</td>
                      <td className="py-1 text-right">{w.ageInDays != null ? `${w.ageInDays} j` : '—'}</td>
                      <td className="py-1 text-right">{w.animalCount}</td>
                      <td className="py-1 text-right">{formatNumber(w.totalWeight, 2)} kg</td>
                      <td className="py-1 text-right">{w.averageWeight != null ? `${formatNumber(w.averageWeight, 3)} kg` : '—'}</td>
                      <td className="py-1 text-right">{w.dailyGainGrams != null ? `${w.dailyGainGrams} g/j` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Timeline events={s.lotEvents} />
          </section>

          <footer className="border-t border-slate-200 pt-3 text-center text-xs text-slate-500">
            Document édité avec RabbitFarm.
          </footer>
        </div>
      )}
    </div>
  );
}

export default function LotTrackingSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <TrackingSheet lotId={id} />
    </AuthGuard>
  );
}
