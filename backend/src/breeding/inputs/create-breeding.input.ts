import { Field, ID, InputType } from '@nestjs/graphql';

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

  @Field({
    nullable: true,
    defaultValue: false,
    description:
      "Confirme l'accouplement malgré un avertissement généalogique (jamais un blocage).",
  })
  acknowledgeWarnings?: boolean;
}
