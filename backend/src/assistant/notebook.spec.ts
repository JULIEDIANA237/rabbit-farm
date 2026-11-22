import { tidyNotebook } from './notebook.js';

describe('lecture du cahier', () => {
  it('fusionne les doublons, ajoute les lapins des saillies et marque les codes connus', () => {
    const out = tidyNotebook(
      {
        rabbits: [{ code: ' F01 ', sex: 'UNKNOWN' }, { code: 'f01', sex: 'FEMALE', breed: 'Néo-Zélandais' }],
        breedings: [{ femaleCode: 'F01', maleCode: 'M1', date: '2026-11-02' }, { femaleCode: 'F02', maleCode: 'M1' }, { femaleCode: 'X', maleCode: 'x' }],
        unreadable: ['F0? 1/1?'],
      },
      ['M1'],
    );
    expect(out.rabbits).toEqual([
      expect.objectContaining({ code: 'F01', sex: 'FEMALE', breed: 'Néo-Zélandais', exists: false }),
      expect.objectContaining({ code: 'M1', sex: 'MALE', exists: true }),
      expect.objectContaining({ code: 'F02', sex: 'FEMALE' }),
    ]);
    expect(out.breedings).toHaveLength(2);
    expect(out.warnings).toEqual(['Illisible : « F0? 1/1? »', '1 saillie(s) sans date : ajoute la date avant d’enregistrer.']);
  });
});
