import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UploadRabbitPhotoInput {
  @Field({
    nullable: true,
  })
  isPrimary?: boolean;
}