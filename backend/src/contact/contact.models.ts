import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ContactMessageInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @Field({ description: 'E-mail ou numéro de téléphone / WhatsApp' })
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  contact: string;

  @Field()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @Field({ nullable: true, description: 'Champ piège invisible : rempli seulement par les robots.' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}

@ObjectType()
export class ContactMessageModel {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() contact: string;
  @Field() message: string;
  @Field() handled: boolean;
  @Field() createdAt: Date;
}

/** Prix affichés sur la page d'accueil (sans compte). */
@ObjectType()
export class PublicPricingModel {
  @Field(() => Int) trialDays: number;
  @Field(() => Int) monthlyPrice: number;
  @Field(() => Int) yearlyPrice: number;
}
