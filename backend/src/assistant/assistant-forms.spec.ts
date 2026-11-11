import { prepareForm, prefillHref, type FormLookups, type RabbitRef } from './assistant-forms.js';

const rabbits: RabbitRef[] = [
  { id: 'f-1', code: 'F12', sex: 'FEMALE', status: 'ACTIVE' },
  { id: 'm-1', code: 'M03', sex: 'MALE', status: 'ACTIVE' },
  { id: 'f-2', code: 'F99', sex: 'FEMALE', status: 'DEAD' },
];

const lookups: FormLookups = {
  findRabbit: async (code) => rabbits.find((rabbit) => rabbit.code.toLowerCase() === code.toLowerCase()) ?? null,
  findOpenBreeding: async (femaleId) => (femaleId === 'f-1' ? { id: 'br-1', status: 'PREGNANT' } : null),
};

const query = (href: string | null) => new URL(`http://x${href}`).searchParams;

describe('prepareForm (brouillons de l’IA)', () => {
  it('convertit une mise bas en champs du formulaire et pointe vers l’accouplement en cours', async () => {
    const result = await prepareForm('BIRTH', { femaleCode: 'f12', date: '2026-11-07', liveBorn: 7, stillBorn: 1 }, lookups);

    expect(result.fields).toEqual({ date: '2026-11-07', liveBorn: '7', stillBorn: '1' });
    expect(result.warnings).toEqual([]);
    expect(result.summary).toBe('Mise bas de F12 : 7 vivant(s), 1 mort-né(s)');
    const params = query(result.href);
    expect(params.get('action')).toBe('birth');
    expect(params.get('breedingId')).toBe('br-1');
    expect(JSON.parse(params.get('prefill') ?? '{}')).toEqual(result.fields);
  });

  it('prévient quand la femelle n’a pas d’accouplement en cours', async () => {
    const result = await prepareForm('PALPATION', { femaleCode: 'F99', result: 'PREGNANT' }, lookups);

    expect(result.href).toBeNull();
    expect(result.warnings).toEqual([
      'F99 n’est plus actif dans l’élevage.',
      'Aucun accouplement en cours pour F99 : enregistre d’abord la saillie.',
    ]);
  });

  it('remplace les codes par les identifiants pour une saillie et signale les inconnus et le mauvais sexe', async () => {
    const ok = await prepareForm('BREEDING', { femaleCode: 'F12', maleCode: 'M03', date: '2026-11-06' }, lookups);
    expect(ok.fields).toEqual({ femaleId: 'f-1', maleId: 'm-1', breedingDate: '2026-11-06' });

    const wrong = await prepareForm('BREEDING', { femaleCode: 'M03', maleCode: 'X1' }, lookups);
    expect(wrong.fields).toEqual({ femaleId: 'm-1' });
    expect(wrong.warnings).toEqual([
      'M03 n’est pas enregistré comme femelle.',
      'Aucun lapin « X1 » trouvé pour le mâle.',
    ]);
  });

  it('ignore les valeurs hors schéma au lieu de les recopier', async () => {
    const result = await prepareForm('EXPENSE', { amount: 'beaucoup', category: 'FEED' }, lookups);
    expect(result.fields).toEqual({});
    expect(result.warnings).toEqual(['Certaines informations n’ont pas pu être comprises.']);
  });

  it('prépare une dépense', async () => {
    const result = await prepareForm(
      'EXPENSE',
      { amount: 15000, category: 'FEED', description: '2 sacs de granulés', paymentMethod: 'MOBILE_MONEY' },
      lookups,
    );
    expect(result.fields).toEqual({ amount: '15000', category: 'FEED', description: '2 sacs de granulés', paymentMethod: 'MOBILE_MONEY' });
    expect(result.href?.startsWith('/operations?new=1&prefill=')).toBe(true);
  });

  it('construit des liens sans paramètre prefill quand il n’y a rien à pré-remplir', () => {
    expect(prefillHref('/tasks', {}, { new: '1' })).toBe('/tasks?new=1');
    expect(prefillHref('/tasks', {})).toBe('/tasks');
  });
});
