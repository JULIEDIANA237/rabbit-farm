import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { FarmRole } from '../auth/graphql/farm-role.enum.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { CreateSectionInput } from './inputs/create-section.input.js';
import { UpdateSectionInput } from './inputs/update-section.input.js';

import { SectionModel } from './models/section.model.js';

import { SectionsService } from './sections.service.js';

@Resolver(() => SectionModel)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class SectionsResolver {
  constructor(
    private readonly sectionsService: SectionsService,
  ) {}

  @Query(() => [SectionModel])
  async sections(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.sectionsService.findAll(
      currentUser,
    );
  }

  @Query(() => SectionModel)
  async section(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.sectionsService.findOne(
      id,
      currentUser,
    );
  }

  @Mutation(() => SectionModel)
  @Roles(FarmRole.ADMIN)
  async createSection(
    @Args('input')
    input: CreateSectionInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.sectionsService.create(
      input,
      currentUser,
    );
  }

  @Mutation(() => SectionModel)
  @Roles(FarmRole.ADMIN)
  async updateSection(
    @Args('input')
    input: UpdateSectionInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.sectionsService.update(
      input,
      currentUser,
    );
  }

  @Mutation(() => SectionModel)
  @Roles(FarmRole.ADMIN)
  async deleteSection(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.sectionsService.remove(
      id,
      currentUser,
    );
  }
}