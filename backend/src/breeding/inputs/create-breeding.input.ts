import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBreedingInput {
  @Field(() => ID)
  femaleId: string;

  @Field(() => ID)
  maleId: string;

  @Field()
  breedingDate: Date;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => Float, { nullable: true, description: 'Poids de la femelle le jour de la saillie (kg)' })
  femaleWeight?: number;

  @Field(() => Float, { nullable: true, description: 'Poids du mâle le jour de la saillie (kg)' })
  maleWeight?: number;

  @Field({
    nullable: true,
    defaultValue: false,
    description:
      "Confirme l'accouplement malgré un avertissement généalogique (jamais un blocage).",
  })
  acknowledgeWarnings?: boolean;
}
