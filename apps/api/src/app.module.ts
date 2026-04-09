import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { EtablissementModule } from './etablissement/etablissement.module';
import { MailModule } from './mail/mail.module';
import { SignalementModule } from './signalement/signalement.module';
import { PreuveModule } from './preuve/preuve.module';
import { NotificationModule } from './notification/notification.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Load .env globally first
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/safeschool',
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.EMAIL_PORT || '2525', 10),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from:
          process.env.FROM_EMAIL ||
          '"SafeSchool Admin" <noreply@safeschool.com>',
      },
    }),

    UsersModule,
    AuthModule,
    EtablissementModule,
    MailModule,
    SignalementModule,
    PreuveModule,
    NotificationModule,

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
