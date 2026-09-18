import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FarmRole } from '../../generated/prisma/client';
import { getJwtSecret } from '../jwt-secret';

export interface JwtPayload {
  sub: string;
  email: string;
  farmId: string;
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
    if (!payload.sub || !payload.farmId || !payload.role) {
      throw new UnauthorizedException('Token JWT invalide.');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      farmId: payload.farmId,
      role: payload.role,
    };
  }
}