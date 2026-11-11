import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';

import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';

const VALIDITY_MS = 60 * 60_000; // 1 heure

export const hashResetToken = (token: string) => createHash('sha256').update(token).digest('hex');

export function frontendUrl(env: NodeJS.ProcessEnv = process.env) {
  const configured = env.FRONTEND_URL?.trim() || env.CORS_ORIGINS?.split(',')[0]?.trim();
  return (configured || 'http://localhost:3000').replace(/\/$/, '');
}

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  /**
   * Envoie un lien de réinitialisation. Répond toujours `true` pour ne pas
   * révéler quels e-mails ont un compte.
   */
  async request(rawEmail: string): Promise<boolean> {
    const email = rawEmail.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return true;

    const token = randomBytes(32).toString('base64url');
    await this.prisma.$transaction([
      // Un seul lien valide à la fois.
      this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
      this.prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash: hashResetToken(token), expiresAt: new Date(Date.now() + VALIDITY_MS) },
      }),
    ]);

    const link = `${frontendUrl()}/reset-password?token=${encodeURIComponent(token)}`;
    await this.mail
      .send({
        to: user.email,
        subject: 'RabbitFarm : réinitialiser ton mot de passe',
        text: `Bonjour ${user.firstName},\n\nPour choisir un nouveau mot de passe, ouvre ce lien (valable 1 heure) :\n${link}\n\nSi tu n'as rien demandé, ignore ce message : ton mot de passe ne change pas.`,
        html: `<p>Bonjour ${escapeHtml(user.firstName)},</p><p>Pour choisir un nouveau mot de passe, clique sur ce lien (valable 1 heure) :</p><p><a href="${link}">Choisir un nouveau mot de passe</a></p><p>Si tu n'as rien demandé, ignore ce message : ton mot de passe ne change pas.</p>`,
      })
      .catch((error: unknown) => this.logger.error(`Lien de réinitialisation non envoyé : ${String(error)}`));
    return true;
  }

  async reset(token: string, password: string): Promise<boolean> {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash: hashResetToken(token) } });
    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Ce lien n’est plus valable. Demande un nouveau lien de réinitialisation.');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);
    return true;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
