import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalementService } from '@/signalement/signalement.service';
import { SignalementController } from '@/signalement/signalement.controller';
import {
  Signalement,
  SignalementSchema,
} from '@/signalement/schemas/signalement.schema';
import { SignalementMemberModule } from '@/signalement-member/signalement-member.module';
import { PreuveModule } from '@/preuve/preuve.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Signalement.name, schema: SignalementSchema },
    ]),
    SignalementMemberModule,
    PreuveModule,
    UsersModule,
  ],
  controllers: [SignalementController],
  providers: [SignalementService],
  exports: [SignalementService],
})
export class SignalementModule {}
