'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * État de formulaire simple : `bind('champ')` branche un input contrôlé.
 */
export function useForm<T extends Record<string, string | boolean>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const bind = (key: keyof T) => ({
    value: values[key] as string,
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as T[keyof T]),
  });

  const reset = useCallback(() => setValues(initial), [initial]);

  return { values, set, bind, reset, setValues };
}

/**
 * Ouvre une fenêtre de création quand l'URL contient ?new=1
 * (raccourcis de la navigation mobile).
 */
export function useOpenFromQuery(open: () => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === '1') {
      open();
      params.delete('new');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export const toInt = (value: string) => (value === '' ? undefined : Number.parseInt(value, 10));
export const toFloat = (value: string) =>
  value === '' ? undefined : Number.parseFloat(value.replace(',', '.'));
