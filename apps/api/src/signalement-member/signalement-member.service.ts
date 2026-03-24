import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignalementMember, SignalementMemberDocument } from './schemas/signalementMember.schema';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';
import { Signalement, SignalementDocument } from '@/signalement/schemas/signalement.schema';
import { UserRole, StatutSignalement } from '@shared/enums';

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

  async deleteMember(id: Types.ObjectId, currentUser: { id: Types.ObjectId; role: UserRole }): Promise<{ message: string }> {
   
    const member = await this.memberModel.findOne({
      _id: id,
      isDeleted: { $ne: true }
    });

    if (!member) {
      throw new NotFoundException(`Membre avec l'ID "${id}" introuvable ou déjà supprimé.`);
    }

    const signalement = await this.signalementModel.findOne({
      _id: member.signalementId,
      reportedBy: currentUser.id,
      isDeleted: false,
    });

    if (!signalement) {
      throw new ForbiddenException(`Vous n'êtes pas autorisé à supprimer ce membre.`);
    }

    
    const STATUTS_BLOQUES = [
      StatutSignalement.RESOLU,
      StatutSignalement.REJETE,
      StatutSignalement.EN_INVESTIGATION,
      StatutSignalement.ESCALADE,
    ];

    if (STATUTS_BLOQUES.includes(signalement.status)) {
      throw new BadRequestException(
        `Impossible de supprimer un membre d'un signalement avec le statut "${signalement.status}".`
      );
    }

  
    member.isDeleted = true;
    member.deletedAt = new Date();
    await member.save();

    return { message: 'Membre supprimé avec succès.' };
  }
}
