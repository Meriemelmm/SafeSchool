import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalementMemberService } from './signalement-member.service';
import { SignalementMemberController } from './signalement-member.controller';
import { SignalementMember, SignalementMemberSchema } from './schemas/signalementMember.schema';
import { Signalement, SignalementSchema } from '@/signalement/schemas/signalement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SignalementMember.name, schema: SignalementMemberSchema },
      { name: Signalement.name, schema: SignalementSchema }
    ]),
  ],
  controllers: [SignalementMemberController],
  providers: [SignalementMemberService],
  exports: [SignalementMemberService],
})
export class SignalementMemberModule {}
