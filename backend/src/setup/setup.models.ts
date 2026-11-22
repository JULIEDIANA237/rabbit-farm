import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SetupStepModel {
  @Field() key: string;
  @Field() title: string;
  @Field() detail: string;
  @Field() href: string;
  @Field(() => String, { nullable: true }) altLabel?: string | null;
  @Field(() => String, { nullable: true }) altHref?: string | null;
  @Field() done: boolean;
}

@ObjectType({ description: 'Démarrage de la ferme : étapes, avancement et compteurs pour le menu simplifié' })
export class FarmSetupModel {
  @Field(() => [SetupStepModel]) steps: SetupStepModel[];
  @Field(() => Int) done: number;
  @Field(() => Int) total: number;
  @Field(() => Int) percent: number;
  @Field(() => Int) farmAgeDays: number;
  @Field({ description: 'Menu simplifié proposé par défaut (ferme récente pas encore prête)' }) beginner: boolean;
  @Field(() => Int) rabbits: number;
  @Field(() => Int) breedings: number;
  @Field(() => Int) litters: number;
  @Field(() => Int) lots: number;
}

// ------------------------------------------------------------ photo du cahier

@ObjectType()
export class NotebookRabbitModel {
  @Field() code: string;
  @Field() sex: string;
  @Field(() => String, { nullable: true }) birthDate?: string | null;
  @Field(() => String, { nullable: true }) breed?: string | null;
  @Field(() => String, { nullable: true }) color?: string | null;
  @Field(() => String, { nullable: true }) note?: string | null;
  @Field({ description: 'Ce code existe déjà dans la ferme' }) exists: boolean;
}

@ObjectType()
export class NotebookBreedingModel {
  @Field() femaleCode: string;
  @Field() maleCode: string;
  @Field(() => String, { nullable: true }) date?: string | null;
  @Field(() => String, { nullable: true }) note?: string | null;
}

@ObjectType({ description: 'Ce que l’IA a lu sur la photo du cahier (rien n’est encore enregistré)' })
export class NotebookDraftModel {
  @Field(() => [NotebookRabbitModel]) rabbits: NotebookRabbitModel[];
  @Field(() => [NotebookBreedingModel]) breedings: NotebookBreedingModel[];
  @Field(() => [String]) warnings: string[];
}

@InputType()
export class NotebookRabbitInput {
  @Field() code: string;
  @Field({ description: 'MALE, FEMALE ou UNKNOWN' }) sex: string;
  @Field(() => String, { nullable: true }) birthDate?: string | null;
  @Field(() => String, { nullable: true }) breed?: string | null;
  @Field(() => String, { nullable: true }) color?: string | null;
  @Field(() => String, { nullable: true }) note?: string | null;
}

@InputType()
export class NotebookBreedingInput {
  @Field() femaleCode: string;
  @Field() maleCode: string;
  @Field() date: string;
  @Field(() => String, { nullable: true }) note?: string | null;
}

@InputType()
export class ImportNotebookInput {
  @Field(() => [NotebookRabbitInput]) rabbits: NotebookRabbitInput[];
  @Field(() => [NotebookBreedingInput]) breedings: NotebookBreedingInput[];
}

@ObjectType()
export class ImportNotebookResultModel {
  @Field(() => Int) rabbits: number;
  @Field(() => Int) breedings: number;
  @Field(() => [String]) errors: string[];
}
