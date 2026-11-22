'use client';

import { Contrast, Moon, Sun } from 'lucide-react';

import { THEMES, setTheme, useTheme, type Theme } from '@/lib/theme';

const ICONS: Record<Theme, typeof Sun> = { day: Sun, night: Moon, contrast: Contrast };
const NEXT: Record<Theme, Theme> = { day: 'night', night: 'contrast', contrast: 'day' };

/** Bouton de l'en-tête : passe à l'apparence suivante (Jour, Nuit, Plein soleil). */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme();
  const Icon = ICONS[theme];
  const next = THEMES.find((t) => t.value === NEXT[theme])!;
  return (
    <button
      type="button"
      onClick={() => setTheme(next.value)}
      aria-label={`Apparence : ${THEMES.find((t) => t.value === theme)!.label}. Passer en ${next.label}`}
      title={`Passer en ${next.label}`}
      className={`rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 ${className}`}
    >
      <Icon size={20} />
    </button>
  );
}

/** Choix de l'apparence dans les Paramètres. */
export function ThemePicker() {
  const theme = useTheme();
  return (
    <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Apparence">
      {THEMES.map((t) => {
        const Icon = ICONS[t.value];
        const active = t.value === theme;
        return (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(t.value)}
            className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
              active ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Icon size={20} className={active ? 'text-emerald-700' : 'text-slate-600'} />
            <span>
              <span className="block font-semibold text-slate-900">{t.label}</span>
              <span className="block text-slate-600">{t.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
