import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { FarmRole } from '../auth/graphql/farm-role.enum';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import type { CurrentUserType } from '../auth/types/current-user.type';

import { CreateRabbitInput } from './inputs/create-rabbit.input';
import { UpdateRabbitInput } from './inputs/update-rabbit.input';
import { AddRabbitIdentificationInput } from './inputs/add-rabbit-identification.input';
import { MoveRabbitInput } from './inputs/move-rabbit.input';
import { RabbitCageMovementModel } from './models/rabbit-cage-movement.model';

import { RabbitModel } from './models/rabbit.model';
import { RabbitIdentificationModel } from './models/rabbit-identification.model';

import { RabbitsService } from './rabbits.service';

@Resolver(() => RabbitModel)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class RabbitsResolver {
  constructor(
    private readonly rabbitsService: RabbitsService,
  ) {}

  /**
   * Liste des lapins.
   */
  @Query(() => [RabbitModel])
  async rabbits(
    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.findAll(
      currentUser,
    );
  }

  /**
   * Détail d'un lapin.
   */
  @Query(() => RabbitModel)
  async rabbit(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.findOne(
      id,
      currentUser,
    );
  }

  /**
   * Création d'un lapin.
   */
  @Mutation(() => RabbitModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async createRabbit(
    @Args('input')
    input: CreateRabbitInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.create(
      input,
      currentUser,
    );
  }

  /**
   * Modification d'un lapin.
   */
  @Mutation(() => RabbitModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async updateRabbit(
    @Args('input')
    input: UpdateRabbitInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.update(
      input,
      currentUser,
    );
  }

  /**
   * Ajout d'une identification physique.
   */
  @Mutation(() => RabbitIdentificationModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
  )
  async addRabbitIdentification(
    @Args('rabbitId', {
      type: () => ID,
    })
    rabbitId: string,

    @Args('input')
    input: AddRabbitIdentificationInput,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.addIdentification(
      rabbitId,
      input,
      currentUser,
    );
  }

  /**
   * Identifications d'un lapin.
   */
  @Query(() => [RabbitIdentificationModel])
  async rabbitIdentifications(
    @Args('rabbitId', {
      type: () => ID,
    })
    rabbitId: string,

    @CurrentUser()
    currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.getIdentifications(
      rabbitId,
      currentUser,
    );
  }

  @Mutation(() => RabbitCageMovementModel)
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER, FarmRole.EMPLOYEE)
  async moveRabbit(
    @Args('input') input: MoveRabbitInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.moveRabbit(input, currentUser);
  }

  @Query(() => [RabbitCageMovementModel])
  async rabbitCageMovements(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.getRabbitCageMovements(
      rabbitId,
      currentUser,
    );
  }
}