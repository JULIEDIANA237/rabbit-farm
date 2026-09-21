import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CompleteFatteningLotInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  exitDate?: Date;

  @Field({ nullable: true })
  observation?: string;
}
