import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  farmName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  farmDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  farmLocation?: string;
}
