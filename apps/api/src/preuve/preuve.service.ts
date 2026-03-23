import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import { Preuve, PreuveDocument } from './schemas/preuve.schema';
import { TypeEpreuve } from '@shared/enums';

@Injectable()
export class PreuveService {
  private readonly uploadPath = './uploads/preuves';

  constructor(
    @InjectModel(Preuve.name) private preuveModel: Model<PreuveDocument>,
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
    console.log(" files",files);

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
}
