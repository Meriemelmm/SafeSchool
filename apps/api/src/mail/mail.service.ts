import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDocument } from '@/users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserWelcome(user: UserDocument, plainPassword: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Votre compte SafeSchool a été créé',
        text: `Bonjour ${user.firstName},

Votre compte a été créé avec succès par un administrateur.

Voici vos identifiants temporaires :
Email : ${user.email}
Mot de passe : ${plainPassword}

Veuillez vous connecter et changer votre mot de passe dès que possible.

L'équipe SafeSchool`,
        html: `
          <h3>Bonjour ${user.firstName},</h3>
          <p>Votre compte a été créé avec succès par un administrateur sur <b>SafeSchool</b>.</p>
          <p>Voici vos identifiants temporaires :</p>
          <ul>
            <li><b>Email :</b> ${user.email}</li>
            <li><b>Mot de passe :</b> <span style="background-color:#f4f4f4;padding:2px 5px;border-radius:4px;">${plainPassword}</span></li>
          </ul>
          <p><i>Veuillez vous connecter et changer votre mot de passe dès que possible.</i></p>
        `,
      });

      console.log(`Email envoyé avec succès à ${user.email}`);
    } catch (error) {
      console.error(
        `Erreur lors de l'envoi de l'email à ${user.email}:`,
        error,
      );
    }
  }
}
