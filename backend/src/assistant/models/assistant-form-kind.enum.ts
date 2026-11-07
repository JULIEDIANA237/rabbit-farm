import { registerEnumType } from '@nestjs/graphql';

export enum AssistantFormKind {
  BREEDING = 'BREEDING',
  PALPATION = 'PALPATION',
  BIRTH = 'BIRTH',
  HEALTH = 'HEALTH',
  EXPENSE = 'EXPENSE',
  TASK = 'TASK',
  RABBIT_EXIT = 'RABBIT_EXIT',
}

registerEnumType(AssistantFormKind, {
  name: 'AssistantFormKind',
  description: 'Formulaires que l’IA sait pré-remplir',
});
