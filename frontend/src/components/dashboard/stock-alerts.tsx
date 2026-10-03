'use client';

import { AlertTriangle, Package } from 'lucide-react';

import type { DashboardStockAlert } from '@/types/dashboard.types';

interface Props {
  items: DashboardStockAlert[];
}

export function StockAlerts({ items }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Alertes de stock
          </h2>

          <p className="text-sm text-slate-500">
            Articles proches ou sous le seuil minimum.
          </p>
        </div>

        <Package className="text-amber-500" size={20} />
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-emerald-600">
          Tous les stocks sont à un niveau correct.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-amber-100 bg-amber-50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={16}
                    className="text-amber-600"
                  />

                  <span className="text-sm font-semibold text-slate-800">
                    {item.name}
                  </span>
                </div>

                <span className="text-xs text-slate-500">
                  {item.unit}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-xs">
                <span className="text-slate-500">
                  Stock actuel
                </span>

                <strong className="text-amber-700">
                  {item.currentStock} {item.unit}
                </strong>
              </div>

              {item.minimumStock != null && (
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-slate-500">
                    Minimum
                  </span>

                  <span>
                    {item.minimumStock} {item.unit}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}