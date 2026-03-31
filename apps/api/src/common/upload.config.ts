import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/preuves',
    filename: (req, file, cb) => {
      const ext = extname(file.originalname) || '.bin';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`Type ${file.mimetype} non autorisé`), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 },
};
