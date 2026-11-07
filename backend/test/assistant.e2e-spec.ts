import type { INestApplication } from '@nestjs/common';
import type { LanguageModelV4GenerateResult } from '@ai-sdk/provider';
import { MockLanguageModelV4 } from 'ai/test';

import { ASSISTANT_MODEL } from '../src/assistant/assistant.service';
import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql';

/**
 * Assistant IA : le fournisseur est remplacé par un modèle simulé.
 * On vérifie que l'assistant lit les données de la ferme, prépare des
 * brouillons sans rien enregistrer, et que tout reste utilisable sans clé.
 */

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 10, text: 10, reasoning: 0 },
} as unknown as LanguageModelV4GenerateResult['usage'];

const toolCall = (toolName: string, input: Record<string, unknown>, id: string): LanguageModelV4GenerateResult => ({
  content: [{ type: 'tool-call', toolCallId: id, toolName, input: JSON.stringify(input) }],
  finishReason: { unified: 'tool-calls', raw: 'tool_calls' },
  usage,
  warnings: [],
});

const textReply = (text: string): LanguageModelV4GenerateResult => ({
  content: [{ type: 'text', text }],
  finishReason: { unified: 'stop', raw: 'stop' },
  usage,
  warnings: [],
});

describe('Assistant IA (e2e)', () => {
  describe('sans clé API', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
      ({ app } = await createTestApp());
      token = await registerFarm(app, 'sans-ia');
    });

    afterAll(async () => {
      await app.close();
    });

    it('se déclare désactivé et refuse proprement les questions', async () => {
      const status = await gqlOk(app, '{ assistantStatus { enabled provider } }', {}, token);
      expect(status.assistantStatus).toEqual({ enabled: false, provider: 'google' });

      const result = await gql(
        app,
        'mutation ($input: AskAssistantInput!) { askAssistant(input: $input) { text } }',
        { input: { message: 'Bonjour' } },
        token,
      );
      expect(result.errors?.[0].message).toContain("n'est pas configuré");
    });

    it('calcule quand même le point du jour', async () => {
      await gqlOk(
        app,
        'mutation ($input: CreateTaskInput!) { createTask(input: $input) { id } }',
        { input: { title: 'Nettoyer les abreuvoirs', dueDate: daysAgo(2) } },
        token,
      );
      const data = await gqlOk(app, '{ dailyBriefing(withSummary: true) { items { key count href } summary } }', {}, token);
      expect(data.dailyBriefing.items).toContainEqual({ key: 'OVERDUE', count: 1, href: '/tasks' });
      expect(data.dailyBriefing.summary).toBeNull();
    });
  });

  describe('avec un modèle (simulé)', () => {
    let app: INestApplication;
    let token: string;
    const ids: Record<string, string> = {};
    const model = new MockLanguageModelV4();
    const prompts: string[] = [];
    /** Programme les réponses successives du modèle et garde les prompts reçus. */
    const script = (...results: LanguageModelV4GenerateResult[]) => {
      prompts.length = 0;
      model.doGenerate = async (options) => {
        prompts.push(JSON.stringify(options.prompt));
        return results.shift() ?? textReply('fin');
      };
    };

    const run = <T = any>(query: string, variables?: Record<string, unknown>) => gqlOk<T>(app, query, variables, token);

    beforeAll(async () => {
      ({ app } = await createTestApp((builder) => builder.overrideProvider(ASSISTANT_MODEL).useValue(model)));
      token = await registerFarm(app, 'ia');

      for (const [key, code, sex] of [
        ['female', 'F12', 'FEMALE'],
        ['male', 'M03', 'MALE'],
      ] as const) {
        const data = await run(
          'mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }',
          { input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(300) } },
        );
        ids[key] = data.createRabbit.id;
      }
      const breeding = await run(
        'mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }',
        { input: { femaleId: ids.female, maleId: ids.male, breedingDate: daysAgo(31) } },
      );
      ids.breeding = breeding.createBreeding.id;
    });

    afterAll(async () => {
      await app.close();
    });

    it('lit les données de la ferme puis prépare une mise bas sans l’enregistrer', async () => {
      script(
        toolCall('lireAccouplements', { femaleCode: 'F12' }, 'call-1'),
        toolCall('preparerMiseBas', { femaleCode: 'F12', liveBorn: 7, stillBorn: 1 }, 'call-2'),
        textReply('Brouillon prêt : vérifie puis valide la mise bas de F12.'),
      );

      const data = await run(
        `mutation ($input: AskAssistantInput!) {
          askAssistant(input: $input) { text drafts { form summary fields warnings href } }
        }`,
        { input: { message: 'F12 a mis bas 8 petits dont 1 mort', page: '/dashboard' } },
      );

      expect(data.askAssistant.text).toBe('Brouillon prêt : vérifie puis valide la mise bas de F12.');
      const [draft] = data.askAssistant.drafts;
      expect(draft).toMatchObject({ form: 'BIRTH', warnings: [], summary: 'Mise bas de F12 : 7 vivant(s), 1 mort-né(s)' });
      expect(JSON.parse(draft.fields)).toEqual({ liveBorn: '7', stillBorn: '1' });
      expect(draft.href).toContain(`breedingId=${ids.breeding}`);
      expect(draft.href).toContain('action=birth');

      // Le résultat de l'outil de lecture a bien été renvoyé au modèle.
      const secondPrompt = prompts[1];
      expect(secondPrompt).toContain('M03');
      expect(secondPrompt).toContain('AWAITING_PALPATION');

      // Rien n'a été enregistré.
      const births = await run('{ births { id } }');
      expect(births.births).toHaveLength(0);
    });

    it('n’expose pas les lapins d’une autre ferme', async () => {
      const otherToken = await registerFarm(app, 'ia-voisine');
      script(toolCall('lireFicheLapin', { code: 'F12' }, 'call-x'), textReply('ok'));

      await gqlOk(
        app,
        'mutation ($input: AskAssistantInput!) { askAssistant(input: $input) { text } }',
        { input: { message: 'Fiche de F12 ?' } },
        otherToken,
      );
      const toolResult = prompts[1];
      expect(toolResult).toContain('Aucun lapin');
      expect(toolResult).not.toContain(ids.female);
    });

    it('remplit un formulaire à partir d’une phrase', async () => {
      script(textReply(JSON.stringify({ femaleCode: 'F12', liveBorn: 6, stillBorn: 2, date: '2026-11-07' })));

      const data = await run(
        `mutation ($input: FillFormInput!) { fillFormWithAi(input: $input) { form fields warnings href } }`,
        { input: { form: 'BIRTH', text: 'Elle a fait 8 dont 2 morts aujourd’hui', context: 'Femelle : F12' } },
      );

      expect(data.fillFormWithAi.form).toBe('BIRTH');
      expect(JSON.parse(data.fillFormWithAi.fields)).toEqual({ date: '2026-11-07', liveBorn: '6', stillBorn: '2' });
      expect(data.fillFormWithAi.warnings).toEqual([]);
    });

    it('rédige un résumé du point du jour', async () => {
      await run('mutation ($input: CreateTaskInput!) { createTask(input: $input) { id } }', {
        input: { title: 'Vacciner', dueDate: daysAgo(1) },
      });
      script(textReply('Commence par la tâche en retard.'));

      const data = await run('{ dailyBriefing(withSummary: true) { items { key } summary } }');
      expect(data.dailyBriefing.summary).toBe('Commence par la tâche en retard.');
      expect(data.dailyBriefing.items.map((item: { key: string }) => item.key)).toContain('OVERDUE');
    });

    it('transforme une panne du fournisseur en message clair', async () => {
      model.doGenerate = async () => {
        throw new Error('quota dépassé');
      };
      const result = await gql(
        app,
        'mutation ($input: AskAssistantInput!) { askAssistant(input: $input) { text } }',
        { input: { message: 'Bonjour' } },
        token,
      );
      expect(result.errors?.[0].message).toContain('ne répond pas');
    });
  });
});
