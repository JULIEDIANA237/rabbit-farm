import { Field, ObjectType } from '@nestjs/graphql';

/** Conseil proposé par l'assistant d'élevage sur le tableau de bord. */
@ObjectType()
export class FarmSuggestionModel {
  @Field()
  key: string;

  @Field({ description: 'TODO (à faire), PLAN (à prévoir) ou IDEA (suggestion)' })
  kind: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  detail?: string;

  @Field()
  href: string;

  @Field()
  actionLabel: string;

  @Field({ description: 'info, warning, danger ou success' })
  tone: string;
}
