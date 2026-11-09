'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

export type Prefill = Record<string, string>;

/** Paramètres d'URL consommés par les raccourcis et l'assistant IA. */
const COMMAND_PARAMS = ['new', 'prefill', 'action', 'breedingId', 'exit'];

/** Événement émis après une navigation vers la page déjà affichée. */
export const URL_COMMAND_EVENT = 'rabbitfarm:url-command';

export function parsePrefill(raw: string | null): Prefill | undefined {
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
        .map(([key, value]) => [key, String(value)]),
    );
  } catch {
    return undefined;
  }
}

/**
 * Exécute `handler` avec les paramètres de l'URL au chargement de la page,
 * puis à chaque commande envoyée par l'assistant. Si le handler les
 * consomme (retourne true), ils sont retirés de l'URL.
 */
export function useUrlCommand(handler: (params: URLSearchParams) => boolean) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    const run = () => {
      if (window.location.pathname !== pathname) return;
      const params = new URLSearchParams(window.location.search);
      if (!handlerRef.current(params)) return;
      COMMAND_PARAMS.forEach((key) => params.delete(key));
      const query = params.toString();
      window.history.replaceState(window.history.state, '', `${pathname}${query ? `?${query}` : ''}`);
    };
    run();
    window.addEventListener(URL_COMMAND_EVENT, run);
    return () => window.removeEventListener(URL_COMMAND_EVENT, run);
  }, []);
}

/**
 * Ouvre une fenêtre de création quand l'URL contient ?new=1
 * (raccourcis de la navigation mobile, brouillons de l'assistant IA).
 * `prefill` contient alors les champs à pré-remplir.
 */
export function useOpenFromQuery(open: (prefill?: Prefill) => void) {
  useUrlCommand((params) => {
    if (params.get('new') !== '1') return false;
    open(parsePrefill(params.get('prefill')));
    return true;
  });
}

/**
 * État d'ouverture d'une fenêtre de création, avec un éventuel brouillon.
 * `key` change à chaque ouverture pour réinitialiser le formulaire.
 */
export function useCreateModal() {
  const [state, setState] = useState<{ open: boolean; prefill?: Prefill; key: number }>({ open: false, key: 0 });
  const open = useCallback((prefill?: Prefill) => setState((prev) => ({ open: true, prefill, key: prev.key + 1 })), []);
  const close = useCallback(() => setState((prev) => ({ ...prev, open: false, prefill: undefined })), []);
  useOpenFromQuery(open);
  return { ...state, openModal: open, close };
}

export const toInt = (value: string) => (value === '' ? undefined : Number.parseInt(value, 10));
export const toFloat = (value: string) =>
  value === '' ? undefined : Number.parseFloat(value.replace(',', '.'));
