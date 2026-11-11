'use client';

import {
  AlertTriangle,
  Baby,
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  Rabbit,
  Syringe,
  Wheat,
  Home,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { formatMoney } from '@/lib/format';
import { HealthActionsCard } from './health-actions-card';

import { useDashboard } from '@/hooks/use-dashboard';
import { KpiCard } from './kpi-card';
import { UrgentTasks } from './urgent-tasks';
import { ActionCalendar } from './action-calendar';
import { BirthsCard } from './births-card';
import { WeaningCard } from './weaning-card';
import { StockAlerts } from './stock-alerts';
import { ExpenseChart } from './expense-chart';
import { BriefingCard } from '@/components/assistant/briefing-card';

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-slate-200" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl bg-slate-200"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-slate-200" />
        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const {
    dashboard,
    loading,
    error,
    refetch,
  } = useDashboard();
  const client = useApolloClient();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  /** Recharge depuis le serveur tout ce qui est affiché (KPI, point du jour, cartes). */
  async function refresh() {
    setRefreshing(true);
    setRefreshError(null);
    try {
      await client.refetchQueries({ include: 'active' });
      setRefreshedAt(new Date());
    } catch (caught) {
      setRefreshError(caught instanceof Error ? caught.message : 'Actualisation impossible.');
    } finally {
      setRefreshing(false);
    }
  }

  if (loading && !dashboard) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 text-red-600" />

          <div>
            <h2 className="font-semibold text-red-800">
              Impossible de charger le tableau de bord
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error.message}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}

      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Vue d’ensemble
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tableau de bord
          </h1>

          <p className="text-sm text-slate-500">
            Suivi quotidien de votre élevage cunicole.
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : undefined} />
            {refreshing ? 'Actualisation…' : 'Actualiser'}
          </button>
          {refreshError ? (
            <p className="text-xs text-red-600">{refreshError}</p>
          ) : refreshedAt ? (
            <p className="text-xs text-slate-500">
              Mis à jour à {refreshedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          ) : null}
        </div>
      </header>

      <BriefingCard />

      {/* KPI */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          title="Lapins"
          value={dashboard.totalRabbits}
          description={`${dashboard.activeRabbits} actifs`}
          icon={<Rabbit size={20} />}
          variant="success"
        />

        <KpiCard
          title="Mâles reproducteurs"
          value={dashboard.breedingMales}
          icon={<Rabbit size={20} />}
        />

        <KpiCard
          title="Femelles reproductrices"
          value={dashboard.breedingFemales}
          icon={<Rabbit size={20} />}
        />

        <KpiCard
          title="Jeunes lapins"
          value={dashboard.youngRabbits}
          icon={<Baby size={20} />}
        />

        <KpiCard
          title="Tâches aujourd'hui"
          value={dashboard.tasksToday}
          icon={<ClipboardCheck size={20} />}
          variant="info"
        />

        <KpiCard
          title="Tâches urgentes"
          value={dashboard.urgentTasks}
          icon={<AlertTriangle size={20} />}
          variant={dashboard.urgentTasks > 0 ? 'danger' : 'default'}
        />

        <KpiCard
          title="Naissances attendues"
          value={dashboard.expectedBirths}
          icon={<CalendarDays size={20} />}
          variant="warning"
        />

        <KpiCard
          title="Stock faible"
          value={dashboard.lowStockItems}
          icon={<Wheat size={20} />}
          variant={
            dashboard.lowStockItems > 0
              ? 'warning'
              : 'default'
          }
        />
      </section>

      {/* ACTIONS */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Actions d&apos;élevage
          </h2>

          <p className="text-sm text-slate-500">
            Les prochaines opérations à effectuer.
          </p>
        </div>

        <ActionCalendar
          palpations={dashboard.palpationList}
          nests={dashboard.nestInstallationList}
          births={dashboard.expectedBirthList}
          weanings={dashboard.weaningList}
        />
      </section>

      {/* TASKS + ALERTS */}

      <section className="grid gap-6 lg:grid-cols-2">
        <UrgentTasks tasks={dashboard.urgentTaskList} />

        <StockAlerts
          items={dashboard.lowStockList}
        />
      </section>

      {/* BIRTHS + WEANING */}

      <section className="grid gap-6 lg:grid-cols-2">
        <BirthsCard
          recentBirths={dashboard.recentBirthList}
          expectedBirths={dashboard.expectedBirthList}
        />

        <WeaningCard
          weanings={dashboard.weaningList}
        />
      </section>

      {/* TECHNICAL INDICATORS */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          title="Naissances ce mois"
          value={dashboard.birthsThisMonth}
          icon={<Baby size={20} />}
        />

        <KpiCard
          title="Lapereaux nés"
          value={dashboard.kitsBornThisMonth}
          icon={<Baby size={20} />}
          variant="success"
        />

        <KpiCard
          title="Taille moyenne portée"
          value={
            dashboard.averageLitterSize != null
              ? dashboard.averageLitterSize.toFixed(1)
              : '—'
          }
          icon={<Rabbit size={20} />}
        />

        <KpiCard
          title="Réussite reproduction"
          value={
            dashboard.breedingSuccessRate != null
              ? `${dashboard.breedingSuccessRate.toFixed(1)} %`
              : '—'
          }
          icon={<Syringe size={20} />}
          variant="success"
        />
      </section>

      {/* SANTÉ + CAGES */}

      <section className="grid gap-6 lg:grid-cols-2">
        <HealthActionsCard actions={dashboard.healthActionList} />

        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            title="Cages occupées"
            value={`${dashboard.occupiedCages}/${dashboard.totalCages}`}
            description={
              dashboard.totalCages > 0
                ? `${Math.round((dashboard.occupiedCages / dashboard.totalCages) * 100)} % d'occupation`
                : 'Aucune cage'
            }
            icon={<Home size={20} />}
          />
          <KpiCard
            title="Soins à faire"
            value={dashboard.healthActions}
            icon={<Syringe size={20} />}
            variant={dashboard.healthActions > 0 ? 'warning' : 'default'}
          />
          <KpiCard
            title="Ventes du mois"
            value={formatMoney(dashboard.monthlyRevenue)}
            icon={<DollarSign size={20} />}
            variant="success"
          />
          <KpiCard
            title="Dépenses du mois"
            value={formatMoney(dashboard.monthlyExpenses)}
            description={`Marge : ${formatMoney(dashboard.monthlyRevenue - dashboard.monthlyExpenses)}`}
            icon={<DollarSign size={20} />}
          />
        </div>
      </section>

      <section>
        <ExpenseChart monthlyExpenses={dashboard.monthlyExpenses} />
      </section>
    </div>
  );
}