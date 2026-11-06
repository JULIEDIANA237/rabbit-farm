import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSaleItemInput {
  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

  @Field(() => ID, {
    nullable: true,
    description: "Vend tous les lapins actifs d'un lot d'engraissement",
  })
  lotId?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  quantity?: number;

  @Field(() => Float, { nullable: true, description: 'Vente à l’unité' })
  unitPrice?: number;

  @Field(() => Float, { nullable: true, description: 'Vente au poids : poids total (kg)' })
  weightKg?: number;

  @Field(() => Float, { nullable: true, description: 'Vente au poids : prix au kilo' })
  pricePerKg?: number;
}

@InputType()
export class CreateSaleInput {
  @Field(() => ID, { nullable: true })
  customerId?: string;

  @Field()
  saleDate: Date;

  @Field(() => [CreateSaleItemInput])
  items: CreateSaleItemInput[];

  @Field({ nullable: true })
  observation?: string;
}
