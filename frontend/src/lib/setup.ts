import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface SetupStep {
  key: string;
  title: string;
  detail: string;
  href: string;
  altLabel?: string | null;
  altHref?: string | null;
  done: boolean;
}

export interface FarmSetup {
  steps: SetupStep[];
  done: number;
  total: number;
  percent: number;
  farmAgeDays: number;
  beginner: boolean;
  rabbits: number;
  breedings: number;
  litters: number;
  lots: number;
}

export const FARM_SETUP = gql`
  query FarmSetup {
    farmSetup {
      steps { key title detail href altLabel altHref done }
      done
      total
      percent
      farmAgeDays
      beginner
      rabbits
      breedings
      litters
      lots
    }
  }
`;

export function useFarmSetup(skip = false) {
  const { data, loading, refetch } = useQuery<{ farmSetup: FarmSetup }>(FARM_SETUP, {
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });
  return { setup: data?.farmSetup ?? null, loading, refetch };
}

// ------------------------------------------------------------------ menu simplifié

const MENU_KEY = 'rabbitfarm:menu-complet';

/** « full » : l'éleveur a choisi le menu complet ; « simple » : il est revenu au menu simplifié. */
export function readMenuChoice(): 'full' | 'simple' | null {
  try {
    const v = localStorage.getItem(MENU_KEY);
    return v === 'full' || v === 'simple' ? v : null;
  } catch {
    return null;
  }
}

export function saveMenuChoice(choice: 'full' | 'simple') {
  try {
    localStorage.setItem(MENU_KEY, choice);
    window.dispatchEvent(new StorageEvent('storage', { key: MENU_KEY }));
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite seulement.
  }
}

export function subscribeMenuChoice(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

/**
 * Pages visibles en menu simplifié : l'essentiel d'abord, le reste
 * apparaît dès que l'élevage en a besoin (une saillie ouvre les naissances, etc.).
 */
export function unlockedInSimpleMenu(href: string, s: FarmSetup) {
  switch (href) {
    case '/dashboard':
    case '/questions':
    case '/rabbits':
    case '/import':
    case '/breeding':
    case '/tasks':
    case '/farm':
    case '/operations/inventory':
      return true;
    case '/births':
      return s.breedings > 0;
    case '/kits':
    case '/weaning':
      return s.litters > 0;
    case '/fattening':
      return s.litters > 0 || s.lots > 0;
    case '/health':
    case '/care':
    case '/sales':
    case '/operations':
      return s.rabbits > 0;
    case '/sales/ready':
      return s.lots > 0;
    default:
      // Fiches conseils, génétique, statistiques, boîte à outils : après la première portée.
      return s.litters > 0;
  }
}
