import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => Int)
  saleCount: number;

  @Field(() => Float)
  totalPurchases: number;

  @Field(() => Float)
  totalPaid: number;

  @Field(() => Float, { description: 'Crédit restant dû par le client' })
  outstandingBalance: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
