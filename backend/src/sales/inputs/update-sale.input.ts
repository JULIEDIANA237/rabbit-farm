import { Field, ID, InputType } from '@nestjs/graphql';

/** Correction des informations générales d'une vente. */
@InputType()
export class UpdateSaleInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  saleDate?: Date;

  @Field(() => ID, { nullable: true, description: 'Chaîne vide pour retirer le client' })
  customerId?: string;

  @Field({ nullable: true })
  observation?: string;
}
