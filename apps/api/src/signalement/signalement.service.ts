import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Signalement, SignalementDocument } from '@/signalement/schemas/signalement.schema';
import { CreateSignalementDto } from '@/signalement/dto/createsignalement.dto';
import { Nature, StatutSignalement, TypeViolence, UserRole } from '@shared/enums';


@Injectable()
export class SignalementService {
  constructor(
    @InjectModel(Signalement.name) private signalementModel: Model<SignalementDocument>,
  ) { }

  async create(createSignalementDto: CreateSignalementDto, userId: Types.ObjectId): Promise<SignalementDocument> {

    const newSignalement = new this.signalementModel({
      ...createSignalementDto,
      reportedBy: userId,
    });
    return await newSignalement.save();
  }
  async findAll(filter) {
    const { status, nature, typeViolence, page = 1, limit = 10, search } = filter;

    const query: {
      isDeleted: boolean;
      status?: StatutSignalement;
      nature?: Nature;
      typeViolence?: TypeViolence;
      $or?: object[];
    } = { isDeleted: false };

    if (status) query.status = status;
    if (nature) query.nature = nature;
    if (typeViolence) query.typeViolence = typeViolence;


    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [signalements, total] = await Promise.all([
      this.signalementModel
        .find(query)
        .populate({
          path: 'reportedBy',
          select: 'lastName firstName role email',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      this.signalementModel.countDocuments(query),
    ]);

    return {
      data: signalements.map((s) => ({
        ...s,
        reportedBy: s.isAnonymous ? null : s.reportedBy,
      })),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1,
      },
    };
  }
  async findOne(id: string, currentUser: { id: string; role: UserRole }) {
    const isAdminOrTeacher =
      currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.TEACHER;

    const query: any = {
      _id: id,
      isDeleted: false,
    };

    // If student or parent, they can only see their own signalement
    if (!isAdminOrTeacher) {
      query.reportedBy = currentUser.id;
    }

    let dbQuery = this.signalementModel.findOne(query);

    if (isAdminOrTeacher) {
      dbQuery = dbQuery.populate({
        path: 'reportedBy',
        select: 'lastName firstName role email',
      });
    }

    const signalement = await dbQuery.lean();

    if (!signalement) {
      throw new NotFoundException(`Signalement avec l'ID "${id}" introuvable ou vous n'avez pas la permission de le consulter.`);
    }

    return {
      ...signalement,
      reportedBy: isAdminOrTeacher
        ? (signalement.isAnonymous ? null : signalement.reportedBy)
        : undefined,
    };
  }
  async updateStatusSignalement(
  id: Types.ObjectId,
  newStatus: StatutSignalement,
 
) {
  


  

  const signalement = await this.signalementModel.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!signalement) {
    throw new NotFoundException(
      `Signalement avec l'ID "${id}" introuvable.`
    );
  }


  if (signalement.status === newStatus) {
    throw new BadRequestException(
      `Le signalement a déjà le statut "${newStatus}".`
    );
  }


  const transitions: Record<StatutSignalement, StatutSignalement[]> = {
    [StatutSignalement.NOUVEAU]: [
      StatutSignalement.EN_COURS,
      StatutSignalement.REJETE,
    ],
    [StatutSignalement.EN_COURS]: [
      StatutSignalement.EN_INVESTIGATION,
      StatutSignalement.RESOLU,
      StatutSignalement.REJETE,
      StatutSignalement.ESCALADE,
    ],
    [StatutSignalement.EN_INVESTIGATION]: [
      StatutSignalement.RESOLU,
      StatutSignalement.REJETE,
      StatutSignalement.ESCALADE,
    ],
    [StatutSignalement.ESCALADE]: [
      StatutSignalement.EN_INVESTIGATION,
      StatutSignalement.RESOLU,
      StatutSignalement.REJETE,
    ],
    [StatutSignalement.RESOLU]: [],  
    [StatutSignalement.REJETE]: [],   
  };

  const allowedTransitions = transitions[signalement.status];

  if (!allowedTransitions.includes(newStatus)) {
    throw new BadRequestException(
      `Transition invalide : "${signalement.status}" → "${newStatus}" non autorisée.`
    );
  }

  const updated = await this.signalementModel.findByIdAndUpdate(
    id,
    { $set: { status: newStatus } },
    { new: true }
  ).lean();

  return updated;
}
}
