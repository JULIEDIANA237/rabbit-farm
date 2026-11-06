import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

/**
 * Journal d'audit des mutations GraphQL (§57) :
 * qui a fait quoi, sur quelle ferme, et avec quel résultat.
 * Les arguments ne sont pas journalisés (mots de passe, données personnelles).
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<string>() !== 'graphql') {
      return next.handle();
    }

    const gql = GqlExecutionContext.create(context);
    const info = gql.getInfo<{ parentType: { name: string }; fieldName: string }>();

    if (info?.parentType?.name !== 'Mutation') {
      return next.handle();
    }

    const user = gql.getContext<{ req?: { user?: { userId?: string; farmId?: string } } }>()
      .req?.user;
    const who = user?.userId ? `user=${user.userId} farm=${user.farmId}` : 'anonyme';
    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(`${info.fieldName} OK ${who} (${Date.now() - started} ms)`),
        error: (error: Error) =>
          this.logger.warn(`${info.fieldName} ÉCHEC ${who} : ${error.message}`),
      }),
    );
  }
}
