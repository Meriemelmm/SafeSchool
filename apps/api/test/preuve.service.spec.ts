import { Test, TestingModule } from '@nestjs/testing';
import { PreuveService } from '@/preuve/preuve.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BadRequestException, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { UserRole, StatutSignalement, TypeEpreuve } from '@shared/enums';

jest.mock('fs');

describe('PreuveService', () => {
  let service: PreuveService;
  let model: any;
  let signalementModel: any;

  const mockPreuve = {
    _id: new Types.ObjectId(),
    fileUrl: '/uploads/preuves/test.jpg',
    fileType: 'IMAGE',
    signalementId: new Types.ObjectId(),
    isDeleted: false,
    save: jest.fn().mockResolvedValue(true),
  };

  const createMockQuery = (result: any) => {
    const query: any = Promise.resolve(result);
    query.populate = jest.fn().mockReturnThis();
    query.sort = jest.fn().mockReturnThis();
    query.skip = jest.fn().mockReturnThis(),
    query.limit = jest.fn().mockReturnThis(),
    query.lean = jest.fn().mockResolvedValue(result);
    query.exec = jest.fn().mockResolvedValue(result);
    return query;
  };

  const mockSignalement = {
    _id: mockPreuve.signalementId,
    reportedBy: 'user-123',
    status: StatutSignalement.NOUVEAU,
    isDeleted: false,
  };

  beforeEach(async () => {
    model = {
      insertMany: jest.fn(),
      find: jest.fn().mockReturnValue(createMockQuery([mockPreuve])),
      findOne: jest.fn().mockImplementation((q) => createMockQuery(mockPreuve)),
      updateMany: jest.fn().mockReturnValue(createMockQuery(null)),
    };

    signalementModel = {
      findOne: jest.fn().mockImplementation((q) => createMockQuery(mockSignalement)),
    };

    // Reset FS mocks
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreuveService,
        { provide: getModelToken('Preuve'), useValue: model },
        { provide: getModelToken('Signalement'), useValue: signalementModel },
      ],
    }).compile();

    service = module.get<PreuveService>(PreuveService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createManyFromUploadedFiles', () => {
    it('should return early if no files provided', async () => {
      await service.createManyFromUploadedFiles([], 'id');
      expect(model.insertMany).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid signalementId', async () => {
      const files = [{ filename: 'test.jpg', path: '/tmp/test.jpg' }] as any;
      await expect(service.createManyFromUploadedFiles(files, 'invalid')).rejects.toThrow(BadRequestException);
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should insert many proofs with correct types', async () => {
      const files = [
        { filename: 'img.jpg', mimetype: 'image/jpeg', path: '/tmp/img.jpg' },
        { filename: 'vid.mp4', mimetype: 'video/mp4', path: '/tmp/vid.mp4' },
        { filename: 'doc.pdf', mimetype: 'application/pdf', path: '/tmp/doc.pdf' },
        { filename: 'aud.mp3', mimetype: 'audio/mpeg', path: '/tmp/aud.mp3' },
        { filename: 'other.txt', mimetype: 'text/plain', path: '/tmp/other.txt' },
      ] as any;
      const sigId = new Types.ObjectId().toHexString();

      await service.createManyFromUploadedFiles(files, sigId);

      expect(model.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ fileType: TypeEpreuve.IMAGE }),
        expect.objectContaining({ fileType: TypeEpreuve.VIDEO }),
        expect.objectContaining({ fileType: TypeEpreuve.DOCUMENT }),
        expect.objectContaining({ fileType: TypeEpreuve.AUDIO }),
        expect.objectContaining({ fileType: TypeEpreuve.OTHER }),
      ]));
    });

    it('should throw InternalServerErrorException and cleanup if DB insert fails', async () => {
      const files = [{ filename: 'test.jpg', path: '/tmp/test.jpg' }] as any;
      model.insertMany.mockRejectedValue(new Error('DB Error'));
      const sigId = new Types.ObjectId().toHexString();

      await expect(service.createManyFromUploadedFiles(files, sigId)).rejects.toThrow(InternalServerErrorException);
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });

  describe('findAllPreuvesBySignalement', () => {
    it('should return proofs for owner', async () => {
      const user = { id: 'user-123', role: UserRole.STUDENT };
      model.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([mockPreuve]) });

      const result = await service.findAllPreuvesBySignalement(mockSignalement._id.toHexString(), user);

      expect(signalementModel.findOne).toHaveBeenCalledWith(expect.objectContaining({ reportedBy: 'user-123' }));
      expect(result).toEqual([mockPreuve]);
    });

    it('should return proofs for admin without reporter check', async () => {
      const user = { id: 'admin-123', role: UserRole.ADMIN };
      model.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([mockPreuve]) });

      await service.findAllPreuvesBySignalement(mockSignalement._id.toHexString(), user);

      expect(signalementModel.findOne).toHaveBeenCalledWith(expect.not.objectContaining({ reportedBy: expect.anything() }));
    });

    it('should throw NotFoundException if signalement not found', async () => {
      signalementModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      const user = { id: 'u', role: UserRole.STUDENT };

      await expect(service.findAllPreuvesBySignalement('id', user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePreuve', () => {
    const user = { id: 'user-123' };

    it('should throw NotFoundException if preuve not found', async () => {
      model.findOne.mockResolvedValue(null);
      await expect(service.deletePreuve(new Types.ObjectId(), user)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not authorized', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockPreuve));
      signalementModel.findOne.mockReturnValue(createMockQuery(null));

      await expect(service.deletePreuve(mockPreuve._id, user)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if signalement status is blocked', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockPreuve));
      const blockedSig = { ...mockSignalement, status: StatutSignalement.RESOLU };
      signalementModel.findOne.mockReturnValue(createMockQuery(blockedSig));

      await expect(service.deletePreuve(mockPreuve._id, user)).rejects.toThrow(BadRequestException);
    });

    it('should delete successfully', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockPreuve));
      signalementModel.findOne.mockReturnValue(createMockQuery(mockSignalement));

      const result = await service.deletePreuve(mockPreuve._id, user);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(mockPreuve.isDeleted).toBe(true);
      expect(mockPreuve.save).toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });
  });

  describe('softDeleteMany', () => {
    it('should do nothing if ids empty', async () => {
      await service.softDeleteMany([], new Types.ObjectId());
      expect(model.find).not.toHaveBeenCalled();
    });

    it('should unlink files and update DB', async () => {
      model.find.mockResolvedValue([mockPreuve]);
      const sigId = new Types.ObjectId();

      await service.softDeleteMany([mockPreuve._id.toHexString()], sigId);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(model.updateMany).toHaveBeenCalled();
    });
  });

  describe('softDeleteBySignalement', () => {
    it('should call updateMany', async () => {
      const sigId = new Types.ObjectId();
      const date = new Date();
      await service.softDeleteBySignalement(sigId, date);
      expect(model.updateMany).toHaveBeenCalledWith({ signalementId: sigId, isDeleted: false }, { isDeleted: true, deletedAt: date });
    });
  });
});
