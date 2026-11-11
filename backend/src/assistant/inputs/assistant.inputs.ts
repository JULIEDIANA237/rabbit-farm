import { Field, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { AssistantFormKind } from '../models/assistant-form-kind.enum.js';

@InputType()
export class AssistantMessageInput {
  @Field(() => String, { description: 'user ou assistant' })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @Field(() => String)
  @IsString()
  @MaxLength(4000)
  content: string;
}

@InputType()
export class AskAssistantInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;

  @Field(() => [AssistantMessageInput], { nullable: true, description: 'Échanges précédents (20 au plus)' })
  @IsOptional()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AssistantMessageInput)
  history?: AssistantMessageInput[];

  @Field(() => String, { nullable: true, description: 'Page de l’app où se trouve l’utilisateur' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  page?: string;
}

@InputType()
export class FillFormInput {
  @Field(() => AssistantFormKind)
  form: AssistantFormKind;

  @Field(() => String, { description: 'Ce que dit l’éleveur, en langage courant' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text: string;

  @Field(() => String, { nullable: true, description: 'Contexte déjà connu (ex. « Femelle : F12 »)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  context?: string;
}
