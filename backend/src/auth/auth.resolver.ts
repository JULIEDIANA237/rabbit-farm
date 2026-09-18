import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthModel } from './models/auth.model';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthModel)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthModel> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthModel)
  async login(
    @Args('input') input: LoginInput,
  ): Promise<AuthModel> {
    return this.authService.login(input);
  }
}