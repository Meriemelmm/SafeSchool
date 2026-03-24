import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignalementMember, SignalementMemberDocument } from './schemas/signalementMember.schema';
import { CreateMemberDto } from './dto/member.dto';
import { Signalement, SignalementDocument } from '@/signalement/schemas/signalement.schema';
import { UserRole } from '@shared/enums';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SignalementMemberService {
  constructor(
    @InjectModel(SignalementMember.name) private memberModel: Model<SignalementMemberDocument>,
    @InjectModel(Signalement.name) private signalementModel: Model<SignalementDocument>,
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
  async findMembersBySignalment(id: string, currentUser: { id: string; role: UserRole }) {
    const isAdminOrTeacher =
      currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.TEACHER;

    const signalementQuery: any = {
      _id: id,
      isDeleted: false,
    };

    if (!isAdminOrTeacher) {
      signalementQuery.reportedBy = currentUser.id;
    }

    const signalement = await this.signalementModel.findOne(signalementQuery).lean();

    if (!signalement) {
      throw new NotFoundException(`Signalement avec l'ID "${id}" introuvable ou vous n'avez pas la permission de consulter ses membres.`);
    }

    const members = await this.memberModel.find({
      $or: [
        { signalementId: id },
        { signalementId: new Types.ObjectId(id) }
      ],
      isDeleted: { $ne: true }, 
    }).exec();

    return members;
  }
}
