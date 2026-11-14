import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveLotMembersInput {
  @Field(() => ID)
  lotId: string;

  @Field(() => [ID])
  rabbitIds: string[];

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true, description: 'Date de l’opération (par défaut : maintenant)' })
  date?: Date;
}
