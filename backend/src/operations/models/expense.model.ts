import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { ExpenseCategory } from '../graphql/expense-category.enum.js';
import { PaymentMethod } from '../../sales/graphql/payment-method.enum.js';

@ObjectType()
export class ExpenseModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  farmId: string;

  @Field(() => ExpenseCategory)
  category: ExpenseCategory;

  @Field(() => Float)
  amount: number;

  @Field()
  date: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  supplier?: string;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod | null;

  @Field(() => String, { nullable: true })
  observation?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}