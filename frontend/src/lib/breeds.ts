/** Races proposées à l'éleveur : il les ajoute à sa ferme d'un clic. */
export const SUGGESTED_BREEDS = [
  { group: 'Races locales', names: ['Locale (lapin du pays)', 'Locale croisée'] },
  {
    group: 'Races courantes',
    names: [
      'Néo-Zélandais blanc',
      'Californien',
      'Géant des Flandres',
      'Fauve de Bourgogne',
      'Papillon',
      'Rex',
      'Chinchilla',
      'Bélier',
      'Argenté de Champagne',
      'Hyplus (hybride)',
      'Hyla (hybride)',
    ],
  },
] as const;

const normalize = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

/** Races proposées que la ferme n'a pas encore. */
export function missingSuggestions(existing: string[]) {
  const taken = new Set(existing.map(normalize));
  return SUGGESTED_BREEDS.map((g) => ({ group: g.group, names: g.names.filter((n) => !taken.has(normalize(n))) })).filter(
    (g) => g.names.length > 0,
  );
}
