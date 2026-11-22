import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

const DAY = 86_400_000;

/** Adresses e-mail des propriétaires de l'app (variable PLATFORM_ADMIN_EMAILS, séparées par des virgules). */
export function platformAdmins() {
  return (process.env.PLATFORM_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  isAdmin(user: CurrentUserType) {
    return platformAdmins().includes(user.email.toLowerCase());
  }

  /** Note l'application (une note par personne, modifiable). */
  async rate(user: CurrentUserType, stars: number, comment?: string) {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      throw new BadRequestException('La note doit être entre 1 et 5 étoiles.');
    }
    const text = comment?.trim().slice(0, 1000) || null;
    return this.prisma.appRating.upsert({
      where: { userId: user.userId },
      create: { userId: user.userId, farmId: user.farmId, stars, comment: text },
      update: { stars, comment: text, farmId: user.farmId },
    });
  }

  myRating(user: CurrentUserType) {
    return this.prisma.appRating.findUnique({ where: { userId: user.userId } });
  }


  async stats(user: CurrentUserType) {
    if (!this.isAdmin(user)) throw new ForbiddenException('Réservé à la propriétaire de l’application.');
    const now = Date.now();
    const since = (d: number) => new Date(now - d * DAY);
    const [farms, users, newUsers30d, activeUsers7d, activeUsers30d, rabbits, ratings, latest] = await Promise.all([
      this.prisma.farm.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: since(30) } } }),
      this.prisma.user.count({ where: { lastSeenAt: { gte: since(7) } } }),
      this.prisma.user.count({ where: { lastSeenAt: { gte: since(30) } } }),
      this.prisma.rabbit.count({ where: { status: 'ACTIVE' } }),
      this.prisma.appRating.groupBy({ by: ['stars'], _count: { _all: true } }),
      this.prisma.appRating.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
    ]);
    const farmNames = new Map(
      (await this.prisma.farm.findMany({ where: { id: { in: latest.map((r) => r.farmId).filter((x): x is string => !!x) } }, select: { id: true, name: true } }))
        .map((f) => [f.id, f.name]),
    );
    const distribution = [1, 2, 3, 4, 5].map((s) => ratings.find((r) => r.stars === s)?._count._all ?? 0);
    const count = distribution.reduce((a, b) => a + b, 0);
    const average = count ? distribution.reduce((sum, n, i) => sum + n * (i + 1), 0) / count : null;
    return {
      farms, users, newUsers30d, activeUsers7d, activeUsers30d, rabbits,
      ratingsCount: count,
      averageRating: average != null ? Math.round(average * 10) / 10 : null,
      ratingDistribution: distribution,
      latestRatings: latest.map((r) => ({ ...r, farmName: r.farmId ? farmNames.get(r.farmId) ?? null : null })),
    };
  }
}
