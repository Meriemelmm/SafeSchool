import { Injectable, BadRequestException, InternalServerErrorException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import { Preuve, PreuveDocument } from './schemas/preuve.schema';
import { TypeEpreuve, UserRole, StatutSignalement } from '@shared/enums';
import { Signalement, SignalementDocument } from '@/signalement/schemas/signalement.schema';

@Injectable()
export class PreuveService {
  private readonly uploadPath = './uploads/preuves';

  constructor(
    @InjectModel(Preuve.name) private preuveModel: Model<PreuveDocument>,
    @InjectModel(Signalement.name) private signalementModel: Model<SignalementDocument>,
  ) {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async createManyFromUploadedFiles(files: Express.Multer.File[], signalementId: string): Promise<void> {
    if (!files || files.length === 0) return;

    // 1. Validation de l'ObjectId
    if (!Types.ObjectId.isValid(signalementId)) {
      this.cleanupFiles(files);
      throw new BadRequestException('ID de signalement invalide');
    }
    console.log(" files", files);

    try {
      const proofs = files.map((file) => {
        let fileType = TypeEpreuve.OTHER;

        if (file.mimetype.startsWith('image/')) {
          fileType = TypeEpreuve.IMAGE;
        } else if (file.mimetype.startsWith('video/')) {
          fileType = TypeEpreuve.VIDEO;
        } else if (file.mimetype.startsWith('audio/')) {
          fileType = TypeEpreuve.AUDIO;
        } else if (
          file.mimetype === 'application/pdf' ||
          file.mimetype.includes('word') ||
          file.mimetype.includes('officedocument')
        ) {
          fileType = TypeEpreuve.DOCUMENT;
        }

        return {
          fileUrl: `/uploads/preuves/${file.filename}`,
          fileType,
          signalementId: new Types.ObjectId(signalementId),
        };
      });

      await this.preuveModel.insertMany(proofs);
    } catch (error) {
      // 2. Cleanup en cas d'erreur DB
      this.cleanupFiles(files);
      throw new InternalServerErrorException('Erreur lors de l’enregistrement des preuves');
    }
  }

  private cleanupFiles(files: Express.Multer.File[]) {
    files.forEach(file => {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
  async findAllPreuvesBySignalement(id: string, currentUser: { id: string; role: UserRole }) {
    const isAdminOrTeacher =
      currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.TEACHER;

    const signalementQuery: any = {
      _id: id,
      isDeleted: false,
    };

    if (currentUser.role === UserRole.STUDENT || currentUser.role === UserRole.PARENT) {
      signalementQuery.reportedBy = currentUser.id;
    }

    const signalement = await this.signalementModel.findOne(signalementQuery).lean();

    if (!signalement) {
      throw new NotFoundException(
        `Signalement avec l'ID "${id}" introuvable ou accès refusé.`
      );
    }

    const preuves = await this.preuveModel.find({
      signalementId: signalement._id,
      isDeleted: false,
    }).lean();

    return {
      signalementId: id,
      preuves,
    };
  }

  async deletePreuve(id: Types.ObjectId, currentUser): Promise<{ message: string }> {

    // ── Règle 1 : Preuve existe et non supprimée ──────────────
    const preuve = await this.preuveModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (!preuve) {
      throw new NotFoundException(`Preuve avec l'ID "${id}" introuvable ou déjà supprimée.`);
    }

    // ── Règle 2 : Signalement appartient à l'user ─────────────
    const signalement = await this.signalementModel.findOne({
      _id: preuve.signalementId,
      reportedBy: currentUser.id,
      isDeleted: false,
    });

    if (!signalement) {
      throw new ForbiddenException(`Vous n'êtes pas autorisé à supprimer cette preuve.`);
    }


    const STATUTS_BLOQUES = [
      StatutSignalement.RESOLU,
      StatutSignalement.REJETE,
      StatutSignalement.EN_INVESTIGATION,
      StatutSignalement.ESCALADE,
    ];

    if (STATUTS_BLOQUES.includes(signalement.status)) {
      throw new BadRequestException(
        `Impossible de supprimer une preuve d'un signalement avec le statut "${signalement.status}".`
      );
    }


    const filename = preuve.fileUrl.split('/').pop();
    const filePath = `${this.uploadPath}/${filename}`;

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Erreur suppression fichier ${filePath}:`, error);
      }
    }

    preuve.isDeleted = true;
    preuve.deletedAt = new Date();
    await preuve.save();

    return { message: 'Preuve supprimée avec succès.' };
  }

  async softDeleteMany(ids: string[], signalementId: Types.ObjectId): Promise<void> {
    if (!ids || ids.length === 0) return;

    const preuves = await this.preuveModel.find({
      _id: { $in: ids },
      signalementId,
      isDeleted: false,
    });

    for (const preuve of preuves) {
      const filename = preuve.fileUrl.split('/').pop();
      const filePath = `${this.uploadPath}/${filename}`;

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Erreur suppression fichier ${filePath}:`, error);
        }
      }
    }

    await this.preuveModel.updateMany(
      { _id: { $in: ids }, signalementId },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    ).exec();
  }

  async softDeleteBySignalement(
    signalementId: Types.ObjectId,
    deletedAt: Date,
  ): Promise<void> {
    await this.preuveModel.updateMany(
      { signalementId, isDeleted: false },
      { isDeleted: true, deletedAt },
    );
  }
}
