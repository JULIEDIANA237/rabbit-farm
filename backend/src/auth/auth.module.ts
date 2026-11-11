import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { getJwtSecret } from './jwt-secret';
import { PasswordResetResolver } from './password-reset/password-reset.resolver';
import { PasswordResetService } from './password-reset/password-reset.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PasswordResetService,
    PasswordResetResolver,
  ],

  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}