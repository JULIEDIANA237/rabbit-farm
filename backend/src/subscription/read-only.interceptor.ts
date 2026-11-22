import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { from, Observable, switchMap } from 'rxjs';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { SubscriptionService } from './subscription.service.js';

/** Actions toujours permises, même en lecture seule : compte, notes, rappels et abonnement. */
export const ALWAYS_ALLOWED = new Set([
  'login',
  'register',
  'requestPasswordReset',
  'resetPassword',
  'rateApp',
  'subscribePush',
  'unsubscribePush',
  'sendTestPush',
  'declareSubscriptionPayment',
  'updatePlatformSettings',
  'confirmSubscriptionPayment',
  'rejectSubscriptionPayment',
  'activateSubscription',
  'extendTrial',
  'setFarmFreeAccess',
]);

export const READ_ONLY_MESSAGE =
  'Ton essai gratuit est terminé : l’app est en lecture seule. Abonne-toi (menu Abonnement) pour continuer à enregistrer.';

/**
 * Lecture seule après l'essai : toute mutation GraphQL d'un élevage
 * sans abonnement en cours est refusée, sauf celles de la liste ci-dessus.
 */
@Injectable()
export class ReadOnlyInterceptor implements NestInterceptor {
  constructor(private readonly subscriptions: SubscriptionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<string>() !== 'graphql') return next.handle();
    const gql = GqlExecutionContext.create(context);
    const info = gql.getInfo<{ parentType: { name: string }; fieldName: string }>();
    if (info?.parentType?.name !== 'Mutation' || ALWAYS_ALLOWED.has(info.fieldName)) return next.handle();
    const user = gql.getContext<{ req?: { user?: CurrentUserType } }>().req?.user;
    if (!user?.farmId) return next.handle();
    return from(this.subscriptions.isReadOnly(user)).pipe(
      switchMap((readOnly) => {
        if (readOnly) throw new ForbiddenException(READ_ONLY_MESSAGE);
        return next.handle();
      }),
    );
  }
}
