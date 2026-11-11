import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '../../common/throttle/throttle.js';

import { RequestPasswordResetInput, ResetPasswordInput } from './password-reset.inputs.js';
import { PasswordResetService } from './password-reset.service.js';

@Resolver()
export class PasswordResetResolver {
  constructor(private readonly passwordReset: PasswordResetService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Mutation(() => Boolean, { description: 'Envoie un lien de réinitialisation du mot de passe par e-mail.' })
  requestPasswordReset(@Args('input') input: RequestPasswordResetInput) {
    return this.passwordReset.request(input.email);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => Boolean, { description: 'Choisit un nouveau mot de passe à partir du lien reçu.' })
  resetPassword(@Args('input') input: ResetPasswordInput) {
    return this.passwordReset.reset(input.token, input.password);
  }
}
