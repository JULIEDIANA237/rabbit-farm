import {
  Field,
  InputType,
} from '@nestjs/graphql';

import { SectionType } from '../graphql/section-type.enum';

@InputType()
export class CreateSectionInput {
  @Field()
  name: string;

  @Field(() => SectionType)
  type: SectionType;

  @Field({ nullable: true })
  description?: string;
}