import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { PaymentMethod } from '../graphql/payment-method.enum.js';
import { SaleStatus } from '../graphql/sale-status.enum.js';

@ObjectType()
export class SaleItemModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

  @Field(() => String, { nullable: true })
  rabbitCode?: string | null;

  @Field(() => ID, { nullable: true })
  lotId?: string | null;

  @Field(() => String, { nullable: true })
  lotCode?: string | null;

  @Field(() => Float, { nullable: true })
  weightKg?: number | null;

  @Field(() => Float, { nullable: true })
  pricePerKg?: number | null;

  @Field()
  description: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float)
  totalPrice: number;
}

@ObjectType()
export class PaymentModel {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  paymentDate: Date;

  @Field(() => PaymentMethod)
  method: PaymentMethod;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  observation?: string;
}

@ObjectType()
export class SaleModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  customerId?: string;

  @Field(() => String, { nullable: true })
  customerName?: string | null;

  @Field()
  saleDate: Date;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Float)
  paidAmount: number;

  @Field(() => Float)
  remainingAmount: number;

  @Field(() => SaleStatus)
  status: SaleStatus;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => [SaleItemModel])
  items: SaleItemModel[];

  @Field(() => [PaymentModel])
  payments: PaymentModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
