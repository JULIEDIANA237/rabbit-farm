/**
 * Fonctions pures de généalogie (§16 à §19, §63 du cahier).
 *
 * Elles travaillent sur une carte `id -> { fatherId, motherId }`
 * chargée une seule fois depuis la base, ce qui les rend
 * testables sans PostgreSQL.
 */

export interface PedigreeEntry {
  id: string;
  code?: string;
  fatherId: string | null;
  motherId: string | null;
}

export type PedigreeMap = Map<string, PedigreeEntry>;

export type CompatibilityLevel = 'COMPATIBLE' | 'WARNING' | 'BLOCKED';

export type InbreedingPolicyValue = 'WARN' | 'BLOCK';

export type RelationCode =
  | 'SAME_ANIMAL'
  | 'PARENT_CHILD'
  | 'DIRECT_LINE'
  | 'FULL_SIBLINGS'
  | 'HALF_SIBLINGS'
  | 'COMMON_ANCESTOR';

export interface CompatibilityReason {
  code: RelationCode;
  level: CompatibilityLevel;
  message: string;
}

export interface CompatibilityResult {
  level: CompatibilityLevel;
  reasons: CompatibilityReason[];
  commonAncestorIds: string[];
  /**
   * Coefficient de consanguinité estimé du futur produit
   * (coefficient de parenté de Malécot entre les deux parents).
   * Estimation généalogique : ne remplace pas une analyse ADN (§19).
   */
  inbreedingCoefficient: number;
}

export const DEFAULT_MAX_GENERATIONS = 5;

export function buildPedigreeMap(entries: PedigreeEntry[]): PedigreeMap {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

function parentsOf(id: string, map: PedigreeMap): string[] {
  const entry = map.get(id);

  if (!entry) {
    return [];
  }

  return [entry.fatherId, entry.motherId].filter(
    (parentId): parentId is string => Boolean(parentId),
  );
}

/**
 * Ancêtres d'un lapin avec la génération la plus proche
 * à laquelle chacun apparaît (1 = parent, 2 = grand-parent...).
 */
export function collectAncestors(
  id: string,
  map: PedigreeMap,
  maxGenerations = DEFAULT_MAX_GENERATIONS,
): Map<string, number> {
  const result = new Map<string, number>();
  let frontier = [id];

  for (let generation = 1; generation <= maxGenerations; generation++) {
    const next: string[] = [];

    for (const current of frontier) {
      for (const parentId of parentsOf(current, map)) {
        if (parentId === id || result.has(parentId)) {
          continue;
        }

        result.set(parentId, generation);
        next.push(parentId);
      }
    }

    if (next.length === 0) {
      break;
    }

    frontier = next;
  }

  return result;
}

/**
 * Descendants d'un lapin, avec leur génération (1 = enfant).
 */
export function collectDescendants(
  id: string,
  entries: PedigreeEntry[],
  maxGenerations = DEFAULT_MAX_GENERATIONS,
): Map<string, number> {
  const childrenByParent = new Map<string, string[]>();

  for (const entry of entries) {
    for (const parentId of [entry.fatherId, entry.motherId]) {
      if (!parentId) continue;
      const list = childrenByParent.get(parentId) ?? [];
      list.push(entry.id);
      childrenByParent.set(parentId, list);
    }
  }

  const result = new Map<string, number>();
  let frontier = [id];

  for (let generation = 1; generation <= maxGenerations; generation++) {
    const next: string[] = [];

    for (const current of frontier) {
      for (const childId of childrenByParent.get(current) ?? []) {
        if (childId === id || result.has(childId)) continue;
        result.set(childId, generation);
        next.push(childId);
      }
    }

    if (next.length === 0) break;
    frontier = next;
  }

  return result;
}

/**
 * Vrai si `ancestorId` est un ancêtre de `id`.
 */
export function isAncestor(
  ancestorId: string,
  id: string,
  map: PedigreeMap,
  maxGenerations = 50,
): boolean {
  return collectAncestors(id, map, maxGenerations).has(ancestorId);
}

/**
 * Vrai si définir `fatherId` / `motherId` comme parents de `id`
 * créerait un cycle (le lapin deviendrait son propre ancêtre).
 */
export function wouldCreateCycle(
  id: string,
  parentIds: Array<string | null | undefined>,
  map: PedigreeMap,
): boolean {
  return parentIds.some(
    (parentId) =>
      Boolean(parentId) &&
      (parentId === id || isAncestor(id, parentId as string, map)),
  );
}

/**
 * Ancêtres communs à deux lapins (dans la limite de générations).
 */
export function findCommonAncestors(
  aId: string,
  bId: string,
  map: PedigreeMap,
  maxGenerations = DEFAULT_MAX_GENERATIONS,
): string[] {
  const ancestorsA = collectAncestors(aId, map, maxGenerations);
  const ancestorsB = collectAncestors(bId, map, maxGenerations);

  return [...ancestorsA.keys()].filter((ancestorId) =>
    ancestorsB.has(ancestorId),
  );
}

/**
 * Coefficient de parenté (kinship) de Malécot entre deux individus,
 * calculé récursivement. Le coefficient de consanguinité d'un produit
 * est égal au coefficient de parenté de ses parents.
 *
 * Les parents inconnus contribuent pour 0 : le résultat est donc une
 * borne basse fondée uniquement sur la généalogie connue.
 */
export function kinshipCoefficient(
  aId: string,
  bId: string,
  map: PedigreeMap,
  maxGenerations = DEFAULT_MAX_GENERATIONS,
): number {
  const depthCache = new Map<string, number>();

  const depth = (id: string, guard = new Set<string>()): number => {
    const cached = depthCache.get(id);
    if (cached !== undefined) return cached;
    if (guard.has(id)) return 0;
    guard.add(id);

    const parents = parentsOf(id, map);
    const value =
      parents.length === 0
        ? 0
        : 1 + Math.max(...parents.map((parentId) => depth(parentId, guard)));

    depthCache.set(id, value);
    return value;
  };

  const cache = new Map<string, number>();

  const kinship = (x: string, y: string, budget: number): number => {
    if (budget < 0) return 0;

    const key = x < y ? `${x}|${y}|${budget}` : `${y}|${x}|${budget}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    let value: number;

    if (x === y) {
      const entry = map.get(x);
      const selfInbreeding =
        entry?.fatherId && entry.motherId
          ? kinship(entry.fatherId, entry.motherId, budget - 1)
          : 0;
      value = 0.5 * (1 + selfInbreeding);
    } else {
      // On remonte toujours depuis l'individu le plus "jeune"
      // (un ancêtre a forcément une profondeur inférieure).
      const [younger, other] = depth(x) >= depth(y) ? [x, y] : [y, x];
      const entry = map.get(younger);

      if (!entry || (!entry.fatherId && !entry.motherId)) {
        value = 0;
      } else {
        const viaFather = entry.fatherId
          ? kinship(entry.fatherId, other, budget - 1)
          : 0;
        const viaMother = entry.motherId
          ? kinship(entry.motherId, other, budget - 1)
          : 0;
        value = 0.5 * (viaFather + viaMother);
      }
    }

    cache.set(key, value);
    return value;
  };

  return kinship(aId, bId, maxGenerations * 2);
}

/**
 * Contrôle de compatibilité généalogique avant accouplement (§18, §63).
 *
 * - parent / enfant ou lignée directe        → BLOCKED
 * - frères et sœurs (mêmes père ET mère)      → BLOCKED
 * - demi-frères / demi-sœurs                  → WARNING ou BLOCKED (politique)
 * - ancêtre commun sur plusieurs générations  → WARNING (BLOCKED si politique
 *   BLOCK et ancêtre commun à la 2e génération : cousins germains)
 */
export function checkCompatibility(
  femaleId: string,
  maleId: string,
  map: PedigreeMap,
  policy: InbreedingPolicyValue = 'WARN',
  maxGenerations = DEFAULT_MAX_GENERATIONS,
): CompatibilityResult {
  const reasons: CompatibilityReason[] = [];
  const label = (id: string) => map.get(id)?.code ?? id;

  if (femaleId === maleId) {
    return {
      level: 'BLOCKED',
      reasons: [
        {
          code: 'SAME_ANIMAL',
          level: 'BLOCKED',
          message: 'Un lapin ne peut pas être accouplé avec lui-même.',
        },
      ],
      commonAncestorIds: [],
      inbreedingCoefficient: 0,
    };
  }

  const female = map.get(femaleId);
  const male = map.get(maleId);
  const femaleAncestors = collectAncestors(femaleId, map, maxGenerations);
  const maleAncestors = collectAncestors(maleId, map, maxGenerations);

  // Lignée directe
  const maleInFemaleLine = femaleAncestors.get(maleId);
  const femaleInMaleLine = maleAncestors.get(femaleId);

  if (maleInFemaleLine !== undefined || femaleInMaleLine !== undefined) {
    const generation = maleInFemaleLine ?? femaleInMaleLine ?? 0;
    const isParent = generation === 1;

    reasons.push({
      code: isParent ? 'PARENT_CHILD' : 'DIRECT_LINE',
      level: 'BLOCKED',
      message: isParent
        ? `Relation parent/enfant détectée entre ${label(femaleId)} et ${label(maleId)}.`
        : `${label(femaleId)} et ${label(maleId)} sont en lignée directe (${generation} générations).`,
    });
  }

  // Fratrie
  const sameFather =
    Boolean(female?.fatherId) && female?.fatherId === male?.fatherId;
  const sameMother =
    Boolean(female?.motherId) && female?.motherId === male?.motherId;

  if (sameFather && sameMother) {
    reasons.push({
      code: 'FULL_SIBLINGS',
      level: 'BLOCKED',
      message: `${label(femaleId)} et ${label(maleId)} sont frère et sœur (même père et même mère).`,
    });
  } else if (sameFather || sameMother) {
    const shared = sameFather ? female?.fatherId : female?.motherId;
    reasons.push({
      code: 'HALF_SIBLINGS',
      level: policy === 'BLOCK' ? 'BLOCKED' : 'WARNING',
      message: `${label(femaleId)} et ${label(maleId)} sont demi-frère/sœur (parent commun : ${label(shared as string)}).`,
    });
  }

  // Ancêtres communs plus éloignés
  const commonAncestorIds = [...femaleAncestors.keys()].filter((id) =>
    maleAncestors.has(id),
  );

  // Les parents partagés (déjà signalés comme fratrie) et leurs propres
  // ancêtres ne sont pas signalés une seconde fois.
  const sharedParents = commonAncestorIds.filter(
    (id) => femaleAncestors.get(id) === 1 && maleAncestors.get(id) === 1,
  );
  const coveredBySiblings = new Set(sharedParents);
  for (const parentId of sharedParents) {
    for (const ancestorId of collectAncestors(parentId, map, maxGenerations).keys()) {
      coveredBySiblings.add(ancestorId);
    }
  }

  const distantCommon = commonAncestorIds.filter(
    (id) =>
      !coveredBySiblings.has(id) && id !== maleId && id !== femaleId,
  );

  const directLine =
    maleInFemaleLine !== undefined || femaleInMaleLine !== undefined;

  if (distantCommon.length > 0 && !directLine) {
    const closest = Math.min(
      ...distantCommon.map((id) =>
        Math.max(femaleAncestors.get(id) ?? 0, maleAncestors.get(id) ?? 0),
      ),
    );

    reasons.push({
      code: 'COMMON_ANCESTOR',
      level: policy === 'BLOCK' && closest <= 2 ? 'BLOCKED' : 'WARNING',
      message: `Ancêtre commun détecté : ${distantCommon
        .map(label)
        .join(', ')}.`,
    });
  }

  const level: CompatibilityLevel = reasons.some((r) => r.level === 'BLOCKED')
    ? 'BLOCKED'
    : reasons.some((r) => r.level === 'WARNING')
      ? 'WARNING'
      : 'COMPATIBLE';

  return {
    level,
    reasons,
    commonAncestorIds,
    inbreedingCoefficient: kinshipCoefficient(
      femaleId,
      maleId,
      map,
      maxGenerations,
    ),
  };
}
