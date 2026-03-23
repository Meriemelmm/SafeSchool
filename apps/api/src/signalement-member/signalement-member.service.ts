import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignalementMember, SignalementMemberDocument } from './schemas/signalementMember.schema';
import { CreateMemberDto } from './dto/member.dto';

@Injectable()
export class SignalementMemberService {
  constructor(
    @InjectModel(SignalementMember.name) private memberModel: Model<SignalementMemberDocument>,
  ) {}

 async createMany(
    members: CreateMemberDto[],
    signalementId: string
  ): Promise<SignalementMemberDocument[]> {

    const objectId = new Types.ObjectId(signalementId);

    const membersWithSignalement = members.map((member) => ({
      ...member,
      signalementId: objectId,
    }));
    

    return this.memberModel.insertMany(membersWithSignalement);
  }
}
