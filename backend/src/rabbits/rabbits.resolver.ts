import {
  Args,
  ID,
  Int,
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

import { CreateRabbitInput } from './inputs/create-rabbit.input.js';
import { UpdateRabbitInput } from './inputs/update-rabbit.input.js';
import { AddRabbitIdentificationInput } from './inputs/add-rabbit-identification.input.js';
import { MoveRabbitInput } from './inputs/move-rabbit.input.js';
import { RabbitCageMovementModel } from './models/rabbit-cage-movement.model.js';

import { RabbitModel } from './models/rabbit.model.js';
import { RabbitIdentificationModel } from './models/rabbit-identification.model.js';

import { RabbitsService } from './rabbits.service.js';
import { TraceabilityService } from './traceability.service.js';
import { RabbitHistoryService } from './rabbit-history.service.js';
import { UpdateRabbitHistoryInput } from './inputs/update-rabbit-history.input.js';
import { RabbitTraceabilityModel } from './models/traceability.model.js';
import { RabbitsPaginationInput } from './inputs/rabbits-pagination.input.js';
import { RabbitPageModel } from './models/paginated-rabbits.model.js';
//import { PaginatedRabbitsModel } from './models/paginated-rabbits.model.js';

@Resolver(() => RabbitModel)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class RabbitsResolver {
  constructor(
    private readonly rabbitsService: RabbitsService,
    private readonly traceability: TraceabilityService,
    private readonly history: RabbitHistoryService,
  ) {}

  @Mutation(() => Boolean, {
    description: 'Corrige la date ou l’observation d’un événement de l’historique (cage, lot, sortie)',
  })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  updateRabbitHistoryEvent(
    @Args('input') input: UpdateRabbitHistoryInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.history.update(input, currentUser);
  }

  @Mutation(() => Boolean, {
    description: 'Supprime un événement de l’historique saisi par erreur (cage, lot, sevrage, adoption)',
  })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  deleteRabbitHistoryEvent(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @Args('type') type: string,
    @Args('recordId', { type: () => ID }) recordId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.history.remove(rabbitId, type, recordId, currentUser);
  }

  /**
   * Traçabilité complète d'un lapin (§54).
   */
  @Query(() => RabbitTraceabilityModel)
  async rabbitTraceability(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.traceability.rabbitTraceability(rabbitId, currentUser);
  }

  /**
   * Liste des lapins.
   */
  @Query(() => RabbitPageModel)
async rabbits(
  @CurrentUser() currentUser: CurrentUserType,

  @Args('page', {
    type: () => Int,
    nullable: true,
    defaultValue: 1,
  })
  page: number,

  @Args('limit', {
    type: () => Int,
    nullable: true,
    defaultValue: 10,
  })
  limit: number,

  @Args('search', {
    nullable: true,
  })
  search?: string,
) {
  return this.rabbitsService.findAll(
    currentUser,
    page,
    limit,
    search,
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

  @Query(() => RabbitPageModel)
async rabbitsPaginated(
  @Args('input', {
    nullable: true,
    type: () => RabbitsPaginationInput,
  })
  input: RabbitsPaginationInput = {},

  @CurrentUser()
  currentUser: CurrentUserType,
) {
  return this.rabbitsService.findPaginated(
    currentUser,
    input,
  );
}
  

  @Query(() => [String], {
    description: 'Types d’historique effacés si on supprime ce lapin',
  })
  rabbitDeletionImpact(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.deletionImpact(id, currentUser);
  }

  @Mutation(() => Boolean, {
    description: 'Supprime définitivement un lapin et tout ce qui lui est lié.',
  })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  deleteRabbit(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.rabbitsService.remove(id, currentUser);
  }
}
