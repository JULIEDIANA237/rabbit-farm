import { useSyncExternalStore } from 'react';

import { THEME_KEY } from './theme-boot';

/** Les trois apparences de l'app. `day` est l'apparence par défaut. */
export type Theme = 'day' | 'night' | 'contrast';

export const THEMES: { value: Theme; label: string; hint: string }[] = [
  { value: 'day', label: 'Jour', hint: 'Fond clair, texte noir' },
  { value: 'night', label: 'Nuit', hint: 'Fond sombre, repose les yeux le soir' },
  { value: 'contrast', label: 'Plein soleil', hint: 'Contraste fort, lisible dehors' },
];

const EVENT = 'rabbitfarm:theme-change';

function isTheme(value: unknown): value is Theme {
  return value === 'day' || value === 'night' || value === 'contrast';
}

function read(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return isTheme(saved) ? saved : 'day';
  } catch {
    return 'day';
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Stockage indisponible : le thème vaut pour cette visite seulement.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'day');
}
