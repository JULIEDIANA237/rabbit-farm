import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsString()
  @MinLength(20)
  @MaxLength(200)
  token: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
