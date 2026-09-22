import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthModel } from './models/auth.model';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthModel)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthModel> {
    return this.authService.register(input);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthModel)
  async login(
    @Args('input') input: LoginInput,
  ): Promise<AuthModel> {
    return this.authService.login(input);
  }
}