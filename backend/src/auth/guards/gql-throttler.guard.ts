import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import {
  DEFAULT_THROTTLE,
  THROTTLE_KEY,
  type ThrottleLimit,
} from '../../common/throttle/throttle.js';

interface Hits {
  count: number;
  resetAt: number;
}

interface RequestLike {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

/**
 * Garde globale de limitation de débit, pour HTTP et GraphQL.
 * Compteurs en mémoire, par instance (suffisant contre les abus simples).
 */
@Injectable()
export class GqlThrottlerGuard implements CanActivate {
  private readonly hits = new Map<string, Hits>();
  private lastSweep = 0;

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = this.getRequest(context);
    if (!req) return true;

    const rule =
      this.reflector.getAllAndOverride<ThrottleLimit | undefined>(
        THROTTLE_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? DEFAULT_THROTTLE;

    const now = Date.now();
    this.sweep(now);

    const key = `${clientIp(req)}|${context.getClass().name}.${context.getHandler().name}`;
    const entry = this.hits.get(key);

    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + rule.ttl });
      return true;
    }

    entry.count += 1;
    if (entry.count > rule.limit) {
      throw new HttpException(
        'Trop de requêtes. Réessaie dans un instant.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }

  private getRequest(context: ExecutionContext): RequestLike | undefined {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest<RequestLike>();
    }
    return GqlExecutionContext.create(context).getContext<{ req?: RequestLike }>().req;
  }

  private sweep(now: number) {
    if (now - this.lastSweep < 60_000) return;
    this.lastSweep = now;
    for (const [key, entry] of this.hits) {
      if (entry.resetAt <= now) this.hits.delete(key);
    }
  }
}

function clientIp(req: RequestLike): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return first?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || 'inconnu';
}
