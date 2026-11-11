import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl, MaxLength } from 'class-validator';

@InputType()
export class PushSubscriptionInput {
  @Field()
  @IsUrl({ require_tld: false })
  @MaxLength(1000)
  endpoint: string;

  @Field()
  @IsString()
  @MaxLength(200)
  p256dh: string;

  @Field()
  @IsString()
  @MaxLength(100)
  auth: string;
}

@ObjectType()
export class PushConfigModel {
  @Field({ description: 'Les notifications sont configurées côté serveur (clés VAPID).' })
  enabled: boolean;

  @Field(() => String, { nullable: true })
  publicKey: string | null;
}
