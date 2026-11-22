'use client';

import { useEffect } from 'react';

import { THEME_KEY } from '@/lib/theme-boot';

/**
 * La page d'accueil est dessinée pour l'apparence « Jour » : on la force ici,
 * puis on remet l'apparence choisie par la personne en quittant la page.
 */
export function KeepDayTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = 'day';
    return () => {
      try {
        const saved = localStorage.getItem(THEME_KEY);
        root.dataset.theme = saved === 'night' || saved === 'contrast' ? saved : 'day';
      } catch {
        root.dataset.theme = 'day';
      }
    };
  }, []);
  return null;
}
