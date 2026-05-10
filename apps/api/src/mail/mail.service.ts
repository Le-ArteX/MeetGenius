import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey: string;
  private readonly senderEmail = 'mursalinleon2295@gmail.com';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('BREVO_API_KEY is missing. Emails will be logged to terminal.');
    }
  }

  async sendInvitationEmail(to: string, workspaceName: string, inviterName: string, token: string) {
    const inviteLink = `${this.configService.get('FRONTEND_URL')}/invitations/accept?token=${token}`;
    
    if (!this.apiKey) {
      this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: Invitation to ${workspaceName} | Link: ${inviteLink}`);
      return;
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'MeetGenius', email: this.senderEmail },
          to: [{ email: to }],
          subject: `You've been invited to join ${workspaceName}`,
          htmlContent: `
            <h1>Join ${workspaceName} on MeetGenius</h1>
            <p>${inviterName} has invited you to collaborate on meeting notes.</p>
            <a href="${inviteLink}">Accept Invitation</a>
          `,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      this.logger.log(`Invitation email sent to ${to} via Brevo API`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email: ${error.message}`);
    }
  }

  async sendOtpEmail(to: string, code: string, type: 'REGISTER' | 'RESET') {
    const subject = type === 'REGISTER'
      ? 'Verify your MeetGenius account'
      : 'Your MeetGenius password reset code';

    const headline = type === 'REGISTER'
      ? 'Verify your email'
      : 'Reset your password';

    const subtext = type === 'REGISTER'
      ? 'Enter the code below to complete your registration. It expires in 10 minutes.'
      : 'Enter the code below to reset your password. It expires in 10 minutes.';

    if (!this.apiKey) {
      this.logger.log(`[MOCK OTP] To: ${to} | Code: ${code} | Type: ${type}`);
      return;
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'MeetGenius', email: this.senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #333;">${headline}</h2>
              <p style="color: #666;">${subtext}</p>
              <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; border-radius: 8px; margin: 20px 0;">
                ${code}
              </div>
              <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
          const err = await response.text();
          throw new Error(err);
      }
      this.logger.log(`OTP email (${type}) sent to ${to} via Brevo API`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email: ${error.message}`);
      this.logger.log(`[FALLBACK] Since email failed, here is your OTP code for ${to}: ${code}`);
    }
  }
}
