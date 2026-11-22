import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ArrayMaxSize, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { AgentSuggestionStatus } from '../generated/prisma/client.js';

registerEnumType(AgentSuggestionStatus, { name: 'AgentSuggestionStatus' });

@ObjectType()
export class AgentSuggestionModel {
  @Field(() => ID) id: string;
  @Field() kind: string;
  @Field({ description: 'danger | warning | info' }) severity: string;
  @Field() title: string;
  @Field(() => String, { nullable: true }) detail?: string | null;
  @Field(() => String, { nullable: true }) href?: string | null;
  @Field({ description: 'NONE | CONFIRM_PAYMENT | EXTEND_TRIAL | SEND_EMAIL | REPLY_CONTACT' }) action: string;
  @Field(() => String, { nullable: true }) recipient?: string | null;
  @Field(() => String, { nullable: true }) subject?: string | null;
  @Field(() => String, { nullable: true }) draft?: string | null;
  @Field(() => AgentSuggestionStatus) status: AgentSuggestionStatus;
  @Field(() => String, { nullable: true }) resolvedBy?: string | null;
  @Field(() => Date, { nullable: true }) resolvedAt?: Date | null;
  @Field() createdAt: Date;
}

@ObjectType()
export class AgentBriefModel {
  @Field(() => ID) id: string;
  @Field() text: string;
  @Field() usedAi: boolean;
  @Field(() => Int) pending: number;
  @Field() createdAt: Date;
}

@ObjectType()
export class AgentOverviewModel {
  @Field(() => AgentBriefModel, { nullable: true }) brief?: AgentBriefModel | null;
  @Field(() => [AgentSuggestionModel]) pending: AgentSuggestionModel[];
  @Field({ description: 'Rédaction et questions par IA disponibles' }) aiEnabled: boolean;
  @Field({ description: 'Envoi d’e-mails configuré (RESEND_API_KEY)' }) mailEnabled: boolean;
}

@ObjectType()
export class AgentLogModel {
  @Field(() => ID) id: string;
  @Field({ description: 'AGENT ou OWNER' }) actor: string;
  @Field(() => String, { nullable: true }) actorEmail?: string | null;
  @Field() action: string;
  @Field() summary: string;
  @Field() createdAt: Date;
}

@InputType()
export class AgentChatMessageInput {
  @Field(() => String, { description: 'user ou assistant' })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @Field()
  @IsString()
  @MaxLength(4000)
  content: string;
}

@InputType()
export class AskAgentInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  question: string;

  @Field(() => [AgentChatMessageInput], { nullable: true })
  @IsOptional()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AgentChatMessageInput)
  history?: AgentChatMessageInput[];
}
