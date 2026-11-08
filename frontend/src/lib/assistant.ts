import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export type AssistantForm = 'BREEDING' | 'PALPATION' | 'BIRTH' | 'HEALTH' | 'EXPENSE' | 'TASK' | 'RABBIT_EXIT';

export interface AssistantDraft {
  form: AssistantForm;
  summary: string;
  fields: string;
  warnings: string[];
  href?: string | null;
}

export const ASSISTANT_STATUS = gql`
  query AssistantStatus {
    assistantStatus {
      enabled
      provider
      model
    }
  }
`;

export const ASK_ASSISTANT = gql`
  mutation AskAssistant($input: AskAssistantInput!) {
    askAssistant(input: $input) {
      text
      drafts {
        form
        summary
        fields
        warnings
        href
      }
    }
  }
`;

export const FILL_FORM = gql`
  mutation FillFormWithAi($input: FillFormInput!) {
    fillFormWithAi(input: $input) {
      form
      summary
      fields
      warnings
      href
    }
  }
`;

export const DAILY_BRIEFING = gql`
  query DailyBriefing($withSummary: Boolean) {
    dailyBriefing(withSummary: $withSummary) {
      date
      summary
      items {
        key
        label
        count
        href
        tone
      }
    }
  }
`;

/** L'assistant est-il configuré côté serveur ? (une requête par session) */
export function useAssistantEnabled() {
  const { data } = useQuery<{ assistantStatus: { enabled: boolean } }>(ASSISTANT_STATUS, {
    fetchPolicy: 'cache-first',
  });
  return data?.assistantStatus.enabled ?? false;
}

export function draftFields(draft: Pick<AssistantDraft, 'fields'>): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(draft.fields);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}
