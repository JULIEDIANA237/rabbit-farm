'use client';

import {
  Baby,
  CalendarCheck,
  Home,
  Scale,
} from 'lucide-react';

import type {
  DashboardBirth,
  DashboardBreedingAction,
  DashboardWeaning,
} from '@/types/dashboard.types';

interface Props {
  palpations: DashboardBreedingAction[];
  nests: DashboardBreedingAction[];
  births: DashboardBirth[];
  weanings: DashboardWeaning[];
}

function ActionItem({
  icon,
  title,
  subtitle,
  date,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  date: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <span className="whitespace-nowrap text-xs font-medium text-slate-500">
        {new Date(date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
        })}
      </span>
    </div>
  );
}

export function ActionCalendar({
  palpations,
  nests,
  births,
  weanings,
}: Props) {
  const actions = [
    ...palpations.map((item) => ({
      id: `palpation-${item.id}`,
      title: `Palpation ${item.femaleCode}`,
      subtitle: 'Contrôle de gestation',
      date:
        item.palpationStartDate ??
        item.palpationEndDate ??
        item.breedingDate,
      icon: <CalendarCheck size={18} />,
    })),

    ...nests.map((item) => ({
      id: `nest-${item.id}`,
      title: `Nid ${item.femaleCode}`,
      subtitle: 'Installer le nid',
      date:
        item.nestDate ??
        item.expectedBirthStartDate ??
        item.breedingDate,
      icon: <Home size={18} />,
    })),

    ...births.map((item) => ({
      id: `birth-${item.id}`,
      title: `Naissance ${item.femaleCode}`,
      subtitle: `${item.totalBorn} lapereaux`,
      date: item.birthDate,
      icon: <Baby size={18} />,
    })),

    ...weanings.map((item) => ({
      id: `weaning-${item.id}`,
      title: 'Sevrage',
      subtitle: `${item.quantity} lapereaux`,
      date: item.plannedDate,
      icon: <Scale size={18} />,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {actions.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          Aucune action planifiée.
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {actions.map((action) => (
            <ActionItem
              key={action.id}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              date={action.date}
            />
          ))}
        </div>
      )}
    </div>
  );
}