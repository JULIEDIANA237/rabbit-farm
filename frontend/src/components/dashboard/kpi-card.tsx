'use client';

import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: ReactNode;
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'info';
}

const variants = {
  default: 'bg-white border-slate-200',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
  success: 'bg-emerald-50 border-emerald-200',
  info: 'bg-blue-50 border-blue-200',
};

export function KpiCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${variants[variant]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}