import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class MoveFatteningLotInput {
  @Field(() => ID)
  lotId: string;

  @Field(() => ID)
  cageId: string;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  observation?: string;

  @Field({
    nullable: true,
    defaultValue: true,
    description:
      'Déplace aussi individuellement chaque lapin actif du lot (historique RabbitCageMovement).',
  })
  moveMembers?: boolean;
}
