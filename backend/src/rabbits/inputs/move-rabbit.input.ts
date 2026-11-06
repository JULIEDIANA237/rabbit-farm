import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class MoveRabbitInput {
  @Field(() => ID)
  rabbitId: string;

  @Field(() => ID)
  cageId: string;

  @Field({
    nullable: true,
    description:
      'INITIAL_ASSIGNMENT, BREEDING, MATERNITY, FATTENING, QUARANTINE, CLEANING, HEALTH, SALE, AGGRESSION, OVERCROWDING, SEX_SEPARATION, SIZE_DIFFERENCE, OTHER',
  })
  reason?: string;

  @Field({ nullable: true })
  observation?: string;

  @Field({ nullable: true, description: 'Date du déplacement (maintenant par défaut)' })
  movedAt?: Date;
}
