import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class RabbitPhotoModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  rabbitId: string;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  mimeType: string;

  @Field()
  isPrimary: boolean;

  @Field()
  createdAt: Date;
}