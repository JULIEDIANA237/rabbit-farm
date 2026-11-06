/**
 * Génération des codes lisibles par l'éleveur.
 */

export function formatLitterCode(sequence: number): string {
  return `L${String(sequence).padStart(3, '0')}`;
}

export function formatKitCode(litterCode: string, sequence: number): string {
  return `${litterCode}-${String(sequence).padStart(2, '0')}`;
}

/**
 * Prochain code de portée libre à partir des codes existants
 * (L001, L002… ; les codes personnalisés sont ignorés).
 */
export function nextLitterCode(existingCodes: string[]): string {
  const max = existingCodes.reduce((highest, code) => {
    const match = /^L(\d+)$/.exec(code.trim().toUpperCase());
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return formatLitterCode(max + 1);
}
