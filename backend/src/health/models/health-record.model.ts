import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HealthRecordModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  farmId: string;

  @Field(() => ID)
  rabbitId: string;

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

  @Field({ nullable: true })
  createdById?: string;

  @Field()
  createdAt: Date;
}
