import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFatteningLotInput {
  @Field()
  code: string;

  @Field()
  entryDate: Date;

  @Field({ nullable: true })
  observation?: string;
}
