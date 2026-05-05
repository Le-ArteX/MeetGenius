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
}
