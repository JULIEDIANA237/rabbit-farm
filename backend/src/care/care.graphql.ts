import { Field, ID, InputType, Int, ObjectType, PartialType, registerEnumType } from '@nestjs/graphql';

import { CareScope } from '../generated/prisma/client.js';

registerEnumType(CareScope, {
  name: 'CareScope',
  description: 'À qui le soin a été donné : toute la ferme, un bloc, une cage, un lot ou un lapin',
});

@ObjectType()
export class CareRecordModel {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field()
  careType: string;

  @Field(() => CareScope)
  scope: CareScope;

  @Field(() => ID, { nullable: true })
  sectionId: string | null;

  @Field(() => ID, { nullable: true })
  cageId: string | null;

  @Field(() => ID, { nullable: true })
  lotId: string | null;

  @Field(() => ID, { nullable: true })
  rabbitId: string | null;

  @Field(() => String, { description: 'Libellé de la cible (ex. « Cage C-03 », « Toute la ferme »)' })
  targetLabel: string;

  @Field(() => String, { nullable: true })
  product: string | null;

  @Field(() => String, { nullable: true })
  dose: string | null;

  @Field(() => Int, { nullable: true })
  animalCount: number | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field(() => Date, { nullable: true })
  nextDate: Date | null;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateCareRecordInput {
  @Field()
  date: Date;

  @Field()
  careType: string;

  @Field(() => CareScope, { defaultValue: CareScope.FARM })
  scope: CareScope;

  @Field(() => ID, { nullable: true })
  sectionId?: string;

  @Field(() => ID, { nullable: true })
  cageId?: string;

  @Field(() => ID, { nullable: true })
  lotId?: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

  @Field(() => String, { nullable: true })
  product?: string | null;

  @Field(() => String, { nullable: true })
  dose?: string | null;

  @Field(() => Int, { nullable: true })
  animalCount?: number | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Date, { nullable: true, description: 'Prochain soin : une tâche est créée ce jour-là' })
  nextDate?: Date | null;
}

@InputType()
export class UpdateCareRecordInput extends PartialType(CreateCareRecordInput) {
  @Field(() => ID)
  id: string;

  // Redéfini sans valeur par défaut : absent = inchangé.
  @Field(() => CareScope, { nullable: true })
  scope?: CareScope;
}
