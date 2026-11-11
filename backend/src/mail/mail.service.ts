import { Injectable, Logger } from '@nestjs/common';

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Envoi d'e-mails via l'API Resend (https://resend.com, 3 000 e-mails/mois
 * gratuits). Variables : RESEND_API_KEY et MAIL_FROM.
 *
 * Sans clé, rien n'est envoyé : le message est écrit dans les logs du
 * serveur, ce qui suffit pour tester en local.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger('E-mail');

  get configured() {
    return Boolean(process.env.RESEND_API_KEY?.trim());
  }

  async send(message: MailMessage): Promise<void> {
    if (!this.configured) {
      this.logger.warn(`RESEND_API_KEY absente : e-mail non envoyé à ${message.to}.\n${message.subject}\n${message.text}`);
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM?.trim() || 'RabbitFarm <onboarding@resend.dev>',
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(`Envoi à ${message.to} refusé (${response.status}) : ${body.slice(0, 300)}`);
      throw new Error(`E-mail non envoyé (${response.status})`);
    }
  }
}
