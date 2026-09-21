import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { PaymentMethod } from '../graphql/payment-method.enum';
import { SaleStatus } from '../graphql/sale-status.enum';

@ObjectType()
export class SaleItemModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

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

  @Field()
  saleDate: Date;

  @Field(() => Float)
  totalAmount: number;

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
