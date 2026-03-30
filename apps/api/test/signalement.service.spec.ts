import { Test, TestingModule } from '@nestjs/testing';
import { SignalementService } from '@/signalement/signalement.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { SignalementMemberService } from '@/signalement-member/signalement-member.service';
import { PreuveService } from '@/preuve/preuve.service';
import { StatutSignalement, UserRole, Nature, TypeViolence } from '@shared/enums';

describe('SignalementService', () => {
  let service: SignalementService;
  let model: any;
  let memberService: any;
  let preuveService: any;

  const mockUserId = new Types.ObjectId();
  const mockSignalementId = new Types.ObjectId();

  const mockSignalement = {
    _id: mockSignalementId,
    title: 'Test Incident',
    description: 'Description test',
    reportedBy: mockUserId,
    status: StatutSignalement.NOUVEAU,
    isDeleted: false,
    save: jest.fn().mockResolvedValue(true),
  };

  const createMockQuery = (result: any) => {
    const query: any = Promise.resolve(result);
    query.populate = jest.fn().mockReturnThis();
    query.sort = jest.fn().mockReturnThis();
    query.skip = jest.fn().mockReturnThis();
    query.limit = jest.fn().mockReturnThis();
    query.lean = jest.fn().mockResolvedValue(result);
    query.exec = jest.fn().mockResolvedValue(result);
    return query;
  };

  beforeEach(async () => {
    // Proper constructor mock for Model
    const modelConstructor = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: mockSignalementId }),
    }));

    model = Object.assign(modelConstructor, {
      find: jest.fn().mockReturnValue(createMockQuery([])),
      findOne: jest.fn().mockReturnValue(createMockQuery(mockSignalement)),
      findByIdAndUpdate: jest.fn().mockReturnValue(createMockQuery(mockSignalement)),
      countDocuments: jest.fn(),
      updateOne: jest.fn(),
    });

    memberService = {
      softDeleteBySignalement: jest.fn().mockResolvedValue(undefined),
      synchronizeMembers: jest.fn().mockResolvedValue(undefined),
    };

    preuveService = {
      softDeleteBySignalement: jest.fn().mockResolvedValue(undefined),
      softDeleteMany: jest.fn().mockResolvedValue(undefined),
      createManyFromUploadedFiles: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalementService,
        { provide: getModelToken('Signalement'), useValue: model },
        { provide: SignalementMemberService, useValue: memberService },
        { provide: PreuveService, useValue: preuveService },
      ],
    }).compile();

    service = module.get<SignalementService>(SignalementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a signalement', async () => {
      const dto = { title: 'New' };
      const result = await service.create(dto as any, mockUserId);
      expect(result.title).toBe('New');
      expect(result.reportedBy).toEqual(mockUserId);
    });
  });

  describe('findAll', () => {
    it('should return paginated signalements', async () => {
      const filter = { page: 1, limit: 10, search: 'test' };
      model.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockSignalement]),
      });
      model.countDocuments.mockResolvedValue(1);

      const result = await service.findAll(filter);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(model.find).toHaveBeenCalledWith(expect.objectContaining({
        $or: expect.any(Array),
      }));
    });

    it('should hide reporter for anonymous signalements', async () => {
      const anonSig = { ...mockSignalement, isAnonymous: true, reportedBy: { firstName: 'John' } };
      model.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([anonSig]),
      });
      model.countDocuments.mockResolvedValue(1);

      const result = await service.findAll({});
      expect(result.data[0].reportedBy).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      model.findOne.mockReturnValue(createMockQuery(null));
      await expect(service.findOne('id', { id: 'u', role: UserRole.ADMIN })).rejects.toThrow(NotFoundException);
    });

    it('should return for owner', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockSignalement));
      const result = await service.findOne(mockSignalementId.toHexString(), { id: mockUserId.toHexString(), role: UserRole.STUDENT });
      expect(result._id).toEqual(mockSignalementId);
    });
  });

  describe('updateStatusSignalement', () => {
    it('should throw NotFoundException if missing', async () => {
      model.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      await expect(service.updateStatusSignalement(mockSignalementId, StatutSignalement.EN_COURS)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if same status', async () => {
      model.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(mockSignalement) });
      await expect(service.updateStatusSignalement(mockSignalementId, StatutSignalement.NOUVEAU)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid transition', async () => {
      model.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ status: StatutSignalement.RESOLU }) });
      await expect(service.updateStatusSignalement(mockSignalementId, StatutSignalement.EN_COURS)).rejects.toThrow(BadRequestException);
    });

    it('should update successfully', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockSignalement));
      model.findByIdAndUpdate.mockReturnValue(createMockQuery({ ...mockSignalement, status: StatutSignalement.EN_COURS }));

      const result = await service.updateStatusSignalement(mockSignalementId, StatutSignalement.EN_COURS);
      expect(result).toBeDefined();
      expect(result!.status).toBe(StatutSignalement.EN_COURS);
    });
  });

  describe('deleteSignalement', () => {
    it('should throw ForbiddenException if not authorized', async () => {
      model.findOne.mockResolvedValue({ ...mockSignalement, reportedBy: new Types.ObjectId() });
      await expect(service.deleteSignalement(mockSignalementId.toHexString(), mockUserId.toHexString(), UserRole.STUDENT)).rejects.toThrow(ForbiddenException);
    });

    it('should delete and call dependencies', async () => {
      model.findOne.mockResolvedValue(mockSignalement);
      await service.deleteSignalement(mockSignalementId.toHexString(), mockUserId.toHexString(), UserRole.STUDENT);

      expect(model.updateOne).toHaveBeenCalled();
      expect(preuveService.softDeleteBySignalement).toHaveBeenCalled();
      expect(memberService.softDeleteBySignalement).toHaveBeenCalled();
    });
  });

  describe('updateSignalement', () => {
    it('should throw ForbiddenException if not owner', async () => {
      model.findOne.mockResolvedValue({ ...mockSignalement, reportedBy: new Types.ObjectId() });
      await expect(service.updateSignalement('id', {} as any, { id: mockUserId.toHexString() })).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if status is not Nouveau/EnCours', async () => {
      model.findOne.mockResolvedValue({ ...mockSignalement, status: StatutSignalement.RESOLU });
      await expect(service.updateSignalement('id', {} as any, { id: mockUserId.toHexString() })).rejects.toThrow(BadRequestException);
    });

    it('should update and call relative services', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockSignalement));
      model.findByIdAndUpdate.mockReturnValue(createMockQuery(mockSignalement));
      const updateData = {
        title: 'Updated',
        members: [{ firstName: 'John' }],
        deletedMemberIds: [],
        deletedPreuveIds: ['507f1f77bcf86cd799439011'],
      };

      await service.updateSignalement(mockSignalementId.toHexString(), updateData as any, { id: mockUserId.toHexString() });

      expect(memberService.synchronizeMembers).toHaveBeenCalled();
      expect(preuveService.softDeleteMany).toHaveBeenCalled();
    });
  });

  describe('getMyReports', () => {
    it('should return user reports', async () => {
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockSignalement]),
      });
      model.countDocuments.mockResolvedValue(1);

      const result = await service.getMyReports(mockUserId, {});

      expect(result.data).toHaveLength(1);
      expect(model.find).toHaveBeenCalledWith(expect.objectContaining({ reportedBy: mockUserId }));
    });
  });
});