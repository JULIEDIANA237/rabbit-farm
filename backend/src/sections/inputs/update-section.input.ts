import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import { SectionType } from '../graphql/section-type.enum';

@InputType()
export class UpdateSectionInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => SectionType, {
    nullable: true,
  })
  type?: SectionType;

  @Field({ nullable: true })
  description?: string;
}