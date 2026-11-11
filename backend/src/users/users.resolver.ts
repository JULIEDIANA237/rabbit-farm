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

import { AddMemberInput } from './inputs/add-member.input.js';
import { UpdateMemberRoleInput } from './inputs/update-member-role.input.js';

import { FarmMembershipModel } from './models/farm-membership.model.js';

import { UsersService } from './users.service.js';

@Resolver(() => FarmMembershipModel)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles(FarmRole.ADMIN)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  /**
   * Liste les membres de la ferme courante.
   */
  @Query(() => [FarmMembershipModel])
  async farmMembers(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.usersService.findFarmMembers(
      currentUser,
    );
  }

  /**
   * Ajoute un utilisateur existant
   * à la ferme courante.
   */
  @Mutation(() => FarmMembershipModel)
  async addFarmMember(
    @Args('input')
    input: AddMemberInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.usersService.addMember(
      input,
      currentUser,
    );
  }

  /**
   * Modifie le rôle d'un membre.
   */
  @Mutation(() => FarmMembershipModel)
  async updateFarmMemberRole(
    @Args('input')
    input: UpdateMemberRoleInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.usersService.updateMemberRole(
      input,
      currentUser,
    );
  }

  /**
   * Retire un utilisateur de la ferme.
   *
   * Le compte User reste intact.
   */
  @Mutation(() => FarmMembershipModel)
  async removeFarmMember(
    @Args('membershipId', {
      type: () => ID,
    })
    membershipId: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.usersService.removeMember(
      membershipId,
      currentUser,
    );
  }
}