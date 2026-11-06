import {
  buildPedigreeMap,
  checkCompatibility,
  collectAncestors,
  collectDescendants,
  findCommonAncestors,
  kinshipCoefficient,
  wouldCreateCycle,
  type PedigreeEntry,
} from './genealogy.utils';

/**
 * Arbre de test :
 *
 *            M01 ─┬─ F01
 *                 │
 *        ┌────────┼─────────┐
 *       M02      F10       F11        (frères/sœurs, enfants de M01 × F01)
 *
 *   M02 × F10 → R034 (mâle), R041 (femelle)   (consanguins)
 *   M02 × F20 → R052 (femelle)                 (demi-sœur de R034)
 *   M30 × F11 → R060 (mâle)                    (cousin de R052)
 *   M40 × F40 → R070 (femelle)                 (sans lien)
 */
const entries: PedigreeEntry[] = [
  { id: 'M01', code: 'M01', fatherId: null, motherId: null },
  { id: 'F01', code: 'F01', fatherId: null, motherId: null },
  { id: 'M02', code: 'M02', fatherId: 'M01', motherId: 'F01' },
  { id: 'F10', code: 'F10', fatherId: 'M01', motherId: 'F01' },
  { id: 'F11', code: 'F11', fatherId: 'M01', motherId: 'F01' },
  { id: 'F20', code: 'F20', fatherId: null, motherId: null },
  { id: 'M30', code: 'M30', fatherId: null, motherId: null },
  { id: 'M40', code: 'M40', fatherId: null, motherId: null },
  { id: 'F40', code: 'F40', fatherId: null, motherId: null },
  { id: 'R034', code: 'R034', fatherId: 'M02', motherId: 'F10' },
  { id: 'R041', code: 'R041', fatherId: 'M02', motherId: 'F10' },
  { id: 'R052', code: 'R052', fatherId: 'M02', motherId: 'F20' },
  { id: 'R060', code: 'R060', fatherId: 'M30', motherId: 'F11' },
  { id: 'R070', code: 'R070', fatherId: 'M40', motherId: 'F40' },
];

const map = buildPedigreeMap(entries);

describe('genealogy.utils', () => {
  describe('collectAncestors', () => {
    it('retourne parents (génération 1) et grands-parents (génération 2)', () => {
      const ancestors = collectAncestors('R034', map);

      expect(ancestors.get('M02')).toBe(1);
      expect(ancestors.get('F10')).toBe(1);
      expect(ancestors.get('M01')).toBe(2);
      expect(ancestors.get('F01')).toBe(2);
      expect(ancestors.size).toBe(4);
    });

    it('respecte la limite de générations', () => {
      const ancestors = collectAncestors('R034', map, 1);
      expect([...ancestors.keys()].sort()).toEqual(['F10', 'M02']);
    });

    it('retourne un ensemble vide pour un fondateur', () => {
      expect(collectAncestors('M01', map).size).toBe(0);
    });
  });

  describe('collectDescendants', () => {
    it('retrouve enfants et petits-enfants', () => {
      const descendants = collectDescendants('M02', entries);

      expect(descendants.get('R034')).toBe(1);
      expect(descendants.get('R041')).toBe(1);
      expect(descendants.get('R052')).toBe(1);
      expect(descendants.has('R060')).toBe(false);

      const fromFounder = collectDescendants('M01', entries);
      expect(fromFounder.get('M02')).toBe(1);
      expect(fromFounder.get('R034')).toBe(2);
      expect(fromFounder.get('R060')).toBe(2);
    });
  });

  describe('wouldCreateCycle', () => {
    it('refuse un lapin comme son propre parent', () => {
      expect(wouldCreateCycle('R034', ['R034', 'F10'], map)).toBe(true);
    });

    it('refuse un descendant comme parent', () => {
      // M01 ne peut pas avoir R034 (son petit-fils) comme père.
      expect(wouldCreateCycle('M01', ['R034', null], map)).toBe(true);
    });

    it('accepte des parents sans lien', () => {
      expect(wouldCreateCycle('R070', ['M30', 'F20'], map)).toBe(false);
    });
  });

  describe('findCommonAncestors', () => {
    it('détecte un ancêtre commun sur plusieurs générations', () => {
      // R052 (via M02 → M01/F01) et R060 (via F11 → M01/F01)
      expect(findCommonAncestors('R052', 'R060', map).sort()).toEqual([
        'F01',
        'M01',
      ]);
    });

    it('ne détecte rien entre lapins sans lien', () => {
      expect(findCommonAncestors('R034', 'R070', map)).toEqual([]);
    });
  });

  describe('kinshipCoefficient', () => {
    it('vaut 0 pour des fondateurs sans lien', () => {
      expect(kinshipCoefficient('M40', 'F40', map)).toBe(0);
    });

    it('vaut 0,25 entre un parent et son enfant non consanguin', () => {
      expect(kinshipCoefficient('M30', 'R060', map)).toBeCloseTo(0.25);
    });

    it('vaut 0,25 entre frères et sœurs pleins', () => {
      expect(kinshipCoefficient('M02', 'F10', map)).toBeCloseTo(0.25);
    });

    it('dépasse 0,125 entre demi-frère et demi-sœur lorsque le parent commun est lui-même consanguin', () => {
      // R034 et R052 partagent uniquement M02... mais R034 est consanguin
      // (M02 et F10 sont frère et sœur), ce qui augmente la parenté.
      expect(kinshipCoefficient('R052', 'R070', map)).toBe(0);
      expect(kinshipCoefficient('R034', 'R052', map)).toBeGreaterThan(0.125);
    });

    it('vaut 0,0625 entre cousins germains', () => {
      // R052 (père M02) et R060 (mère F11) : M02 et F11 sont frère et sœur.
      expect(kinshipCoefficient('R052', 'R060', map)).toBeCloseTo(0.0625);
    });
  });

  describe('checkCompatibility', () => {
    it('autorise deux lapins sans lien', () => {
      const result = checkCompatibility('R070', 'R034', map);

      expect(result.level).toBe('COMPATIBLE');
      expect(result.reasons).toHaveLength(0);
      expect(result.inbreedingCoefficient).toBe(0);
    });

    it('bloque père × fille', () => {
      const result = checkCompatibility('R041', 'M02', map);

      expect(result.level).toBe('BLOCKED');
      expect(result.reasons[0].code).toBe('PARENT_CHILD');
    });

    it('bloque grand-père × petite-fille (lignée directe)', () => {
      const result = checkCompatibility('R041', 'M01', map);

      expect(result.level).toBe('BLOCKED');
      expect(result.reasons.map((r) => r.code)).toContain('DIRECT_LINE');
    });

    it('bloque frère × sœur', () => {
      const result = checkCompatibility('R041', 'R034', map);

      expect(result.level).toBe('BLOCKED');
      expect(result.reasons.map((r) => r.code)).toContain('FULL_SIBLINGS');
    });

    it('avertit pour des demi-frères/sœurs avec la politique WARN', () => {
      const result = checkCompatibility('R052', 'R034', map, 'WARN');

      expect(result.reasons.map((r) => r.code)).toContain('HALF_SIBLINGS');
      expect(
        result.reasons.find((r) => r.code === 'HALF_SIBLINGS')?.level,
      ).toBe('WARNING');
    });

    it('bloque des demi-frères/sœurs avec la politique BLOCK', () => {
      const result = checkCompatibility('R052', 'R034', map, 'BLOCK');

      expect(result.level).toBe('BLOCKED');
    });

    it('avertit pour un ancêtre commun éloigné (cousins)', () => {
      const result = checkCompatibility('R052', 'R060', map, 'WARN');

      expect(result.level).toBe('WARNING');
      expect(result.reasons[0].code).toBe('COMMON_ANCESTOR');
      expect(result.reasons[0].message).toContain('M01');
      expect(result.commonAncestorIds.sort()).toEqual(['F01', 'M01']);
      expect(result.inbreedingCoefficient).toBeCloseTo(0.0625);
    });

    it('bloque des cousins germains avec la politique BLOCK', () => {
      const result = checkCompatibility('R052', 'R060', map, 'BLOCK');
      expect(result.level).toBe('BLOCKED');
    });

    it('bloque un lapin avec lui-même', () => {
      expect(checkCompatibility('R034', 'R034', map).level).toBe('BLOCKED');
    });
  });
});
