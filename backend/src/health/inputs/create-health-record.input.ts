import { Field, ID, InputType } from '@nestjs/graphql';

import { HealthRecordType } from '../graphql/health-record-type.enum.js';

@InputType()
export class CreateHealthRecordInput {
  @Field(() => ID)
  rabbitId: string;

  @Field(() => HealthRecordType, { nullable: true, defaultValue: 'OBSERVATION' })
  type?: HealthRecordType;

  @Field()
  date: Date;

  @Field({ nullable: true })
  symptoms?: string;

  @Field({ nullable: true })
  observation?: string;

  @Field({ nullable: true })
  suspicion?: string;

  @Field({ nullable: true })
  diagnosis?: string;

  @Field({ nullable: true })
  treatment?: string;

  @Field({ nullable: true })
  medication?: string;

  @Field({ nullable: true })
  dosage?: string;

  @Field({ nullable: true })
  nextDueDate?: Date;
}
