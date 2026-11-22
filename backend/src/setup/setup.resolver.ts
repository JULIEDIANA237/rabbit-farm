import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { FarmRole } from '../auth/graphql/farm-role.enum.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { Throttle } from '../common/throttle/throttle.js';

import { FarmSetupModel, ImportNotebookInput, ImportNotebookResultModel } from './setup.models.js';
import { SetupService } from './setup.service.js';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SetupResolver {
  constructor(private readonly setup: SetupService) {}

  @Query(() => FarmSetupModel, { description: 'Avancement du démarrage de la ferme' })
  farmSetup(@CurrentUser() user: CurrentUserType) {
    return this.setup.status(user);
  }

  @Mutation(() => ImportNotebookResultModel, { description: 'Enregistre les lapins et saillies validés après la lecture du cahier' })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  importNotebook(@CurrentUser() user: CurrentUserType, @Args('input') input: ImportNotebookInput) {
    return this.setup.importNotebook(user, input);
  }
}
