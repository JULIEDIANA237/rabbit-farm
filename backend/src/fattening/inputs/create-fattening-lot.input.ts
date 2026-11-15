import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFatteningLotInput {
  @Field({ nullable: true, description: 'Laissé vide : LOT-01, LOT-02… généré' })
  code?: string;

  @Field()
  entryDate: Date;

  @Field({ nullable: true })
  observation?: string;
}
