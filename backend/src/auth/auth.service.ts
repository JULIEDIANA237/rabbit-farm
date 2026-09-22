import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur existe déjà avec cet email.',
      );
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });

      const farm = await tx.farm.create({
        data: {
          name: input.farmName,
          description: input.farmDescription,
          location: input.farmLocation,
        },
      });

      await tx.farmMembership.create({
        data: {
          userId: user.id,
          farmId: farm.id,
          role: 'ADMIN',
        },
      });

      return {
        user,
        farm,
      };
    });

    const accessToken = await this.generateToken(
      result.user.id,
      result.user.email,
      result.farm.id,
      'ADMIN',
    );

    return {
      accessToken,
      userId: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      farm: result.farm,
    };
  }

  async login(input: LoginInput) {
    const email = input.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            farm: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    /**
     * Ferme de la session :
     * celle demandée si elle appartient bien
     * à l'utilisateur, sinon la première (tri
     * déterministe par date de création).
     */
    const membership = input.farmId
      ? user.memberships.find(
          (candidate) => candidate.farmId === input.farmId,
        )
      : user.memberships[0];

    if (!membership) {
      throw new UnauthorizedException(
        input.farmId
          ? "L'utilisateur n'est pas membre de cette ferme."
          : "L'utilisateur n'est associé à aucune ferme.",
      );
    }

    const accessToken = await this.generateToken(
      user.id,
      user.email,
      membership.farmId,
      membership.role,
    );

    return {
      accessToken,
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      farm: membership.farm,
    };
  }

  private async generateToken(
    userId: string,
    email: string,
    farmId: string,
    role: string,
  ) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      farmId,
      role,
    });
  }
}