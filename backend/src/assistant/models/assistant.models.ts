import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AssistantFormKind } from './assistant-form-kind.enum.js';

@ObjectType()
export class AssistantStatusModel {
  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => String)
  provider: string;

  @Field(() => String)
  model: string;
}

@ObjectType({ description: 'Brouillon préparé par l’IA, à vérifier puis valider par l’éleveur' })
export class AssistantDraftModel {
  @Field(() => AssistantFormKind)
  form: AssistantFormKind;

  @Field(() => String)
  summary: string;

  @Field(() => String, { description: 'Champs du formulaire (JSON)' })
  fields: string;

  @Field(() => [String])
  warnings: string[];

  @Field(() => String, { nullable: true, description: 'Page où ouvrir le formulaire pré-rempli' })
  href?: string | null;
}

@ObjectType()
export class AssistantReplyModel {
  @Field(() => String)
  text: string;

  @Field(() => [AssistantDraftModel])
  drafts: AssistantDraftModel[];
}

@ObjectType()
export class BriefingItemModel {
  @Field(() => String)
  key: string;

  @Field(() => String)
  label: string;

  @Field(() => Int)
  count: number;

  @Field(() => String)
  href: string;

  @Field(() => String)
  tone: string;
}

@ObjectType()
export class DailyBriefingModel {
  @Field(() => String)
  date: string;

  @Field(() => [BriefingItemModel])
  items: BriefingItemModel[];

  @Field(() => String, { nullable: true, description: 'Résumé rédigé par l’IA (si activée)' })
  summary?: string | null;
}
