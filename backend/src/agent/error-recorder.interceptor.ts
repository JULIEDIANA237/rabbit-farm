import { HttpException, Injectable, Logger, type CallHandler, type ExecutionContext, type NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { catchError, throwError, type Observable } from 'rxjs';

import { PrismaService } from '../prisma/prisma.service.js';

/**
 * Note les erreurs inattendues (hors erreurs métier HttpException) pour que
 * l'agent puisse signaler un pic d'erreurs dans le point du matin.
 */
@Injectable()
export class ErrorRecorderInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Erreurs');

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpException)) this.record(context, error);
        return throwError(() => error);
      }),
    );
  }

  private record(context: ExecutionContext, error: unknown) {
    let source = `${context.getClass().name}.${context.getHandler().name}`;
    if (context.getType<string>() === 'graphql') {
      const field = GqlExecutionContext.create(context).getInfo<{ fieldName?: string }>()?.fieldName;
      if (field) source = field;
    }
    const message = (error instanceof Error ? error.message : String(error)).slice(0, 500);
    this.prisma.appError
      .create({ data: { source: source.slice(0, 120), message } })
      .catch((e: unknown) => this.logger.warn(`Erreur non enregistrée : ${String(e).slice(0, 200)}`));
  }
}
