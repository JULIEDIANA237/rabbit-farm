import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';

import type { CurrentUserType } from '../../auth/types/current-user.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';

/** En-tête envoyé par le téléphone pour une saisie faite hors ligne. */
export const OFFLINE_ID_HEADER = 'x-offline-id';
export const ALREADY_RECEIVED_MESSAGE = 'Saisie hors ligne déjà reçue.';
const VALID_ID = /^[A-Za-z0-9-]{8,64}$/;

/**
 * Une saisie hors ligne porte un identifiant créé sur le téléphone. Si la
 * réponse se perd en route, le téléphone la renvoie : le serveur reconnaît
 * l'identifiant et ne l'enregistre pas une seconde fois.
 */
@Injectable()
export class OfflineSubmissionInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<string>() !== 'graphql') return next.handle();
    const gql = GqlExecutionContext.create(context);
    const info = gql.getInfo<{ parentType: { name: string }; fieldName: string }>();
    if (info?.parentType?.name !== 'Mutation') return next.handle();
    const req = gql.getContext<{ req?: { user?: CurrentUserType; headers?: Record<string, string | string[] | undefined> } }>().req;
    const raw = req?.headers?.[OFFLINE_ID_HEADER];
    const id = Array.isArray(raw) ? raw[0] : raw;
    const farmId = req?.user?.farmId;
    if (!id || !farmId || !VALID_ID.test(id)) return next.handle();

    return from(this.claim(id, farmId, info.fieldName)).pipe(
      switchMap((fresh) => {
        if (!fresh) throw new ConflictException(ALREADY_RECEIVED_MESSAGE);
        return next.handle().pipe(
          // Saisie refusée : l'identifiant est libéré pour un nouvel essai.
          catchError((error: unknown) =>
            from(this.prisma.offlineSubmission.deleteMany({ where: { id } })).pipe(switchMap(() => throwError(() => error))),
          ),
        );
      }),
    );
  }

  /** Vrai si l'identifiant est nouveau (et désormais réservé). */
  private async claim(id: string, farmId: string, field: string) {
    const created = await this.prisma.offlineSubmission.createMany({ data: [{ id, farmId, field }], skipDuplicates: true });
    return created.count === 1;
  }
}
