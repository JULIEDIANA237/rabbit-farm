'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import type { DashboardTask } from '@/types/dashboard.types';

interface Props {
  tasks: DashboardTask[];
}

export function UrgentTasks({ tasks }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Tâches prioritaires
          </h2>

          <p className="text-sm text-slate-500">
            Actions nécessitant votre attention.
          </p>
        </div>

        <AlertTriangle className="text-amber-500" size={20} />
      </div>

      {tasks.length === 0 ? (
        <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
          <CheckCircle2
            size={18}
            className="text-emerald-500"
          />
          Aucune tâche urgente.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-100 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {task.title}
                  </p>

                  {task.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {task.description}
                    </p>
                  )}
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    task.priority === 'URGENT'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Échéance :{' '}
                {new Date(task.dueDate).toLocaleDateString(
                  'fr-FR',
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}