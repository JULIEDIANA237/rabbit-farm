import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBirthInput {
  @Field(() => ID)
  breedingId: string;

  @Field()
  birthDate: Date;

  @Field(() => Int)
  liveBorn: number;

  @Field(() => Int)
  stillBorn: number;

  @Field({ nullable: true })
  observation?: string;

  @Field({
    nullable: true,
    description:
      'Code de la portée (ex. L001). Généré automatiquement si absent.',
  })
  litterCode?: string;

  @Field({
    nullable: true,
    defaultValue: true,
    description:
      'Crée immédiatement les lapereaux individuels L001-01, L001-02… (§12).',
  })
  createKits?: boolean;
}
