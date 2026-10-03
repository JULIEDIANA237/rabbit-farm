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
} from 'lucide-react';

import { useDashboard } from '@/hooks/use-dashboard';
import { KpiCard } from './kpi-card';
import { UrgentTasks } from './urgent-tasks';
import { ActionCalendar } from './action-calendar';
import { BirthsCard } from './births-card';
import { WeaningCard } from './weaning-card';
import { StockAlerts } from './stock-alerts';
import { ExpenseChart } from './expense-chart';

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

        <button
          onClick={() => refetch()}
          className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Actualiser
        </button>
      </header>

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
            Actions d'élevage
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

      {/* FINANCE */}

      <section className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart
          monthlyExpenses={dashboard.monthlyExpenses}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Dépenses du mois
              </h2>

              <p className="text-sm text-slate-500">
                Total enregistré
              </p>
            </div>
          </div>

          <p className="mt-6 text-3xl font-bold text-slate-900">
            {dashboard.monthlyExpenses.toLocaleString(
              'fr-FR',
            )}
          </p>
        </div>
      </section>
    </div>
  );
}