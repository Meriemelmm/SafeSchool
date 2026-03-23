import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalementMemberService } from './signalement-member.service';
import { SignalementMemberController } from './signalement-member.controller';
import { SignalementMember, SignalementMemberSchema } from './schemas/signalementMember.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SignalementMember.name, schema: SignalementMemberSchema }]),
  ],
  controllers: [SignalementMemberController],
  providers: [SignalementMemberService],
  exports: [SignalementMemberService],
})
export class SignalementMemberModule {}
