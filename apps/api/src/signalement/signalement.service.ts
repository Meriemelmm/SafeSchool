import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Signalement,
  SignalementDocument,
} from '@/signalement/schemas/signalement.schema';
import { CreateSignalementDto } from '@/signalement/dto/createsignalement.dto';
import { UpdateSignalementDto } from '@/signalement/dto/updateSignalement.dto';
import {
  Nature,
  StatutSignalement,
  TypeViolence,
  UserRole,
} from '@shared/enums';
import { SignalementMemberService } from '@/signalement-member/signalement-member.service';
import { PreuveService } from '@/preuve/preuve.service';
import { NotificationService } from '@/notification/notification.service';
import { UsersService } from '@/users/users.service';
import { TypeNotification } from '@shared/enums';

@Injectable()
export class SignalementService {
  constructor(
    @InjectModel(Signalement.name)
    private signalementModel: Model<SignalementDocument>,
    private readonly memberService: SignalementMemberService,
    private readonly preuveService: PreuveService,
    private readonly notificationService: NotificationService,
    private readonly usersService: UsersService,
  ) { }

  async create(
    createSignalementDto: CreateSignalementDto,
    userId: Types.ObjectId,
  ): Promise<SignalementDocument> {
    const newSignalement = new this.signalementModel({
      ...createSignalementDto,
      reportedBy: userId,
    });
    const saved = await newSignalement.save();

    // 🔔 Notification : Nouveau signalement pour les admins/teachers
    try {
      const reporter = await this.usersService.findById(userId.toString());
      const authorName = saved.isAnonymous ? 'Anonyme' : (reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Anonyme');

      const staff = await this.usersService.findAdminsAndTeachers();
      const notificationPromises = staff.map((user) =>
        this.notificationService.createAndSend(
          user._id.toString(),
          saved._id.toString(),
          TypeNotification.NOUVEAU_SIGNALEMENT,
          `Rapport : "${saved.title}" — Créé par ${authorName}`,
        ),
      );
      await Promise.all(notificationPromises);
    } catch (err) {
      console.error('Erreur notification creation:', err);
    }

    return saved;
  }
  async findAll(filter) {
    const {
      status,
      nature,
      typeViolence,
      page = 1,
      limit = 10,
      search,
    } = filter;

    const query: {
      isDeleted?: boolean | { $ne: true };
      status?: StatutSignalement;
      nature?: Nature;
      typeViolence?: TypeViolence;
      $or?: object[];
    } = { isDeleted: { $ne: true } };

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
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.TEACHER;

    const query: any = {
      _id: id,
      isDeleted: { $ne: true },
    };

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
      throw new NotFoundException(
        `Signalement avec l'ID "${id}" introuvable ou vous n'avez pas la permission de le consulter.`,
      );
    }

    return {
      ...signalement,
      reportedBy: isAdminOrTeacher
        ? signalement.isAnonymous
          ? null
          : signalement.reportedBy
        : undefined,
    };
  }
  async updateStatusSignalement(
    id: Types.ObjectId,
    newStatus: StatutSignalement,
  ) {
    const signalement = await this.signalementModel
      .findOne({
        _id: id,
        isDeleted: { $ne: true },
      })
      .lean();

    if (!signalement) {
      throw new NotFoundException(`Signalement avec l'ID "${id}" introuvable.`);
    }

    if (signalement.status === newStatus) {
      throw new BadRequestException(
        `Le signalement a déjà le statut "${newStatus}".`,
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
        `Transition invalide : "${signalement.status}" → "${newStatus}" non autorisée.`,
      );
    }

    const updated = await this.signalementModel
      .findByIdAndUpdate(id, { $set: { status: newStatus } }, { new: true })
      .lean();

    // 🔔 Notification : L'auteur reçoit l'info du changement de statut
    try {
      if (updated && updated.reportedBy) {
        await this.notificationService.createAndSend(
          updated.reportedBy.toString(),
          updated._id.toString(),
          TypeNotification.CHANGEMENT_STATUT,
          `Le statut de votre signalement "${updated.title}" a été mis à jour vers : ${newStatus}`,
        );
      }
    } catch (err) {
      console.error('Erreur notification statut update:', err);
    }

    return updated;
  }

  async deleteSignalement(
    id: string,
    deletedByUserId: string,
    userRole: UserRole,
  ): Promise<void> {
    const signalement = await this.signalementModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!signalement) {
      throw new NotFoundException(
        `Signalement ${id} introuvable ou déjà supprimé.`,
      );
    }
    const isPrivileged = [UserRole.ADMIN, UserRole.TEACHER].includes(userRole);
    const isOwner = signalement.reportedBy.toString() === deletedByUserId;

    if (!isPrivileged && !isOwner) {
      throw new ForbiddenException(
        `Vous n'êtes pas autorisé à supprimer ce signalement.`,
      );
    }

    const now = new Date();
    const objectId = new Types.ObjectId(id);

    await Promise.all([
      this.signalementModel.updateOne(
        { _id: objectId },
        {
          isDeleted: true,
          deletedAt: now,
          deletedBy: new Types.ObjectId(deletedByUserId),
        },
      ),
      this.preuveService.softDeleteBySignalement(objectId, now),
      this.memberService.softDeleteBySignalement(objectId, now),
    ]);
  }
  async updateSignalement(
    id: string,
    updateData: UpdateSignalementDto,
    currentUser: any,
    newFiles?: Express.Multer.File[],
  ) {
    const signalement = await this.signalementModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });
    if (!signalement) {
      throw new NotFoundException('Signalement non trouvé');
    }

    if (signalement.reportedBy.toString() !== currentUser.id) {
      throw new ForbiddenException(
        "Vous n'avez pas accès de modifier un signalement qui n'est pas le vôtre",
      );
    }

    const allowedStatus = [
      StatutSignalement.NOUVEAU,
      StatutSignalement.EN_COURS,
    ];
    if (!allowedStatus.includes(signalement.status)) {
      throw new BadRequestException(
        `Modification impossible pour un signalement avec le statut "${signalement.status}"`,
      );
    }

    const objectId = new Types.ObjectId(id);
    const {
      members,
      deletedMemberIds,
      deletedPreuveIds,
      ...signalementUpdates
    } = updateData;

    const promises: Promise<any>[] = [
      this.signalementModel
        .findByIdAndUpdate(
          objectId,
          { $set: signalementUpdates },
          { new: true },
        )
        .lean(),
    ];

    // 1. Synchronisation des membres
    if (members || (deletedMemberIds && deletedMemberIds.length > 0)) {
      promises.push(
        this.memberService.synchronizeMembers(
          objectId,
          members,
          deletedMemberIds,
        ),
      );
    }

    // 2. Suppression des preuves existantes
    if (deletedPreuveIds && deletedPreuveIds.length > 0) {
      promises.push(
        this.preuveService.softDeleteMany(deletedPreuveIds, objectId),
      );
    }

    // 3. Ajout de nouvelles preuves (fichiers)
    if (newFiles && newFiles.length > 0) {
      promises.push(
        this.preuveService.createManyFromUploadedFiles(newFiles, id),
      );
    }

    const [updatedSignalement] = await Promise.all(promises);

    return updatedSignalement;
  }

  /**
   * Retrieve all reports created by the current user (Student or Parent)
   */
  async getMyReports(userId, filter: any = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      nature,
      typeViolence,
    } = filter;
   
    const query: any = {
      reportedBy: userId, // Avoid explicit new Types.ObjectId if already an ObjectId or if Mongoose can cast it
      isDeleted: { $ne: true },
    };
   

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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      this.signalementModel.countDocuments(query),
    ]);

   
    return {
      data: signalements,
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
   async signalementByNature(nature:string){
    console.log("nature",nature);

  const signalementByNature= await this.signalementModel.find({isDeleted:false,nature:nature});
    return signalementByNature;

   }
}
