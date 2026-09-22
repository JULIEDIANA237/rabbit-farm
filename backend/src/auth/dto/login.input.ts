import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Field()
  @IsString()
  @MaxLength(72)
  password: string;

  /**
   * Ferme à utiliser pour la session.
   * Facultatif : à défaut, la première
   * ferme de l'utilisateur est retenue.
   */
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  farmId?: string;
}
