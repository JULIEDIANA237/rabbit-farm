import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { CompanionQuestionStatus } from '../generated/prisma/client.js';

registerEnumType(CompanionQuestionStatus, { name: 'CompanionQuestionStatus' });

@ObjectType()
export class CompanionOptionModel {
  @Field() value: string;
  @Field() label: string;
  @Field(() => String, { nullable: true, description: 'good | bad | neutral' }) tone?: string | null;
  @Field(() => String, { nullable: true }) href?: string | null;
  @Field(() => String, { nullable: true }) adviceKey?: string | null;
  @Field({ description: 'La question reviendra plus tard' }) snooze: boolean;
}

@ObjectType()
export class CompanionQuestionModel {
  @Field(() => ID) id: string;
  @Field() kind: string;
  @Field({ description: 'danger | warning | info' }) severity: string;
  @Field() title: string;
  @Field(() => String, { nullable: true }) detail?: string | null;
  @Field(() => String, { nullable: true }) rabbitId?: string | null;
  @Field(() => [CompanionOptionModel]) options: CompanionOptionModel[];
  @Field(() => String, { nullable: true }) adviceKey?: string | null;
  @Field(() => String, { nullable: true }) href?: string | null;
  @Field() askAt: Date;
  @Field(() => CompanionQuestionStatus) status: CompanionQuestionStatus;
  @Field(() => String, { nullable: true }) answer?: string | null;
  @Field(() => String, { nullable: true }) answerLabel?: string | null;
  @Field(() => Date, { nullable: true }) answeredAt?: Date | null;
  @Field() createdAt: Date;
}

@ObjectType()
export class AdviceSheetModel {
  @Field() key: string;
  @Field() title: string;
  @Field() topic: string;
  @Field() summary: string;
  @Field(() => [String]) signs: string[];
  @Field(() => [String]) actions: string[];
  @Field(() => String, { nullable: true }) vet?: string | null;
}

@ObjectType()
export class CompanionSettingsModel {
  @Field() enabled: boolean;
  @Field(() => Int, { description: 'Notifications de l’assistant par jour (0 à 3)' }) maxPerDay: number;
  @Field(() => String, { nullable: true }) location?: string | null;
  @Field({ description: 'La position de la ferme est connue : alertes de chaleur actives' }) weatherReady: boolean;
}

@InputType()
export class UpdateCompanionSettingsInput {
  @Field({ nullable: true }) @IsOptional() @IsBoolean() enabled?: boolean;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) @Max(3) maxPerDay?: number;
  @Field({ nullable: true, description: 'Ville de la ferme, pour la météo' }) @IsOptional() @IsString() @MaxLength(120) location?: string;
}
