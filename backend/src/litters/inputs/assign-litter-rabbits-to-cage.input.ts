import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AssignLitterRabbitsToCageInput {
  @Field(() => ID)
  litterId: string;

  @Field(() => ID)
  cageId: string;

  @Field(() => [ID])
  rabbitIds: string[];

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  observation?: string;

  @Field({ nullable: true, description: 'Date de mise en cage (par défaut : maintenant)' })
  date?: Date;
}