import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { FarmRole } from '../../generated/prisma/client.js';
import { getJwtSecret } from '../jwt-secret.js';
import { platformAdmins } from '../../platform/platform.service.js';

export interface JwtPayload {
  sub: string;
  email: string;
  /** Absent pour la propriétaire de l'app, qui n'est rattachée à aucune ferme. */
  farmId?: string;
  role: FarmRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Token JWT invalide.');
    }
    // Seule la propriétaire de l'app peut avoir une session sans ferme.
    const owner = platformAdmins().includes(payload.email.toLowerCase());
    if (!payload.farmId && !owner) {
      throw new UnauthorizedException('Token JWT invalide.');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      farmId: owner ? '' : (payload.farmId as string),
      role: payload.role,
    };
  }
}