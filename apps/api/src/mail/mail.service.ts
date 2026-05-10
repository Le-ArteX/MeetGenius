import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail = 'onboarding@resend.dev'; // Default for testing, change to your domain later

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY is missing. Emails will not be sent.');
    }
  }

  async sendInvitationEmail(to: string, workspaceName: string, inviterName: string, token: string) {
    const inviteLink = `${this.configService.get('FRONTEND_URL')}/invitations/accept?token=${token}`;
    
    if (!this.resend) {
      this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: Invitation to ${workspaceName} | Link: ${inviteLink}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: `MeetGenius <${this.fromEmail}>`,
        to: [to],
        subject: `You've been invited to join ${workspaceName}`,
        html: `
          <h1>Join ${workspaceName} on MeetGenius</h1>
          <p>${inviterName} has invited you to collaborate on meeting notes in their workspace.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
          <p>If you don't have an account, you will be prompted to create one.</p>
        `,
      });
      this.logger.log(`Invitation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    if (!this.resend) {
      this.logger.log(
        `[MOCK EMAIL] To: ${to} | Subject: Reset your password | Link: ${resetLink}`,
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: `MeetGenius <${this.fromEmail}>`,
        to: [to],
        subject: 'Reset your MeetGenius password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
            <h1 style="font-size: 24px; font-weight: 700; color: #09090b; margin-bottom: 8px;">Reset your password</h1>
            <p style="font-size: 15px; color: #71717a; margin-bottom: 32px;">
              We received a request to reset the password for your MeetGenius account (<strong style="color: #09090b;">${to}</strong>).
              Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
            </p>
            <a href="${resetLink}"
               style="display: inline-block; padding: 12px 28px; background-color: #09090b; color: #ffffff;
                      text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px;">
              Reset Password
            </a>
            <p style="font-size: 13px; color: #a1a1aa; margin-top: 32px;">
              If you didn't request this, you can safely ignore this email — your password won't change.
            </p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email: ${error.message}`);
    }
  }
}
