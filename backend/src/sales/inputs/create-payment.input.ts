import { Field, Float, ID, InputType } from '@nestjs/graphql';

import { PaymentMethod } from '../graphql/payment-method.enum';

@InputType()
export class CreatePaymentInput {
  @Field(() => ID)
  saleId: string;

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
