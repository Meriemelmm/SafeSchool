import { Test, TestingModule } from '@nestjs/testing';
import { SignalementMemberService } from '@/signalement-member/signalement-member.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UserRole, StatutSignalement } from '@shared/enums';

describe('SignalementMemberService', () => {
  let service: SignalementMemberService;
  let model: any;
  let signalementModel: any;

  const mockMemberId = new Types.ObjectId();
  const mockSignalementId = new Types.ObjectId();
  const mockUserId = new Types.ObjectId();

  const mockMember = {
    _id: mockMemberId,
    firstName: 'John',
    lastName: 'Doe',
    signalementId: mockSignalementId,
    isDeleted: false,
    save: jest.fn().mockResolvedValue(true),
  };

  const mockSignalement = {
    _id: mockSignalementId,
    reportedBy: mockUserId,
    status: StatutSignalement.NOUVEAU,
    isDeleted: false,
  };

  const createMockQuery = (result: any) => {
    const query: any = Promise.resolve(result);
    query.lean = jest.fn().mockResolvedValue(result);
    query.exec = jest.fn().mockResolvedValue(result);
    return query;
  };

  beforeEach(async () => {
    model = {
      insertMany: jest.fn(),
      find: jest.fn().mockReturnValue(createMockQuery([mockMember])),
      findOne: jest.fn().mockImplementation((q) => createMockQuery(mockMember)),
      updateMany: jest.fn().mockReturnValue({ exec: jest.fn() }),
      updateOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
      create: jest.fn(),
    };

    signalementModel = {
      findOne: jest.fn().mockImplementation((q) => createMockQuery(mockSignalement)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalementMemberService,
        { provide: getModelToken('SignalementMember'), useValue: model },
        { provide: getModelToken('Signalement'), useValue: signalementModel },
      ],
    }).compile();

    service = module.get<SignalementMemberService>(SignalementMemberService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMany', () => {
    it('should create many members', async () => {
      const members = [{ firstName: 'A' }] as any;
      await service.createMany(members, mockSignalementId.toHexString());
      expect(model.insertMany).toHaveBeenCalledWith([expect.objectContaining({ signalementId: mockSignalementId })]);
    });
  });

  describe('findMembersBySignalment', () => {
    it('should throw NotFoundException if signalement not found', async () => {
      signalementModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      await expect(service.findMembersBySignalment('id', { id: 'u', role: UserRole.STUDENT })).rejects.toThrow(NotFoundException);
    });

    it('should return members for owner', async () => {
      model.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([mockMember]) });
      const result = await service.findMembersBySignalment(mockSignalementId.toHexString(), { id: mockUserId.toHexString(), role: UserRole.STUDENT });
      expect(result).toEqual([mockMember]);
    });
  });

  describe('deleteMember', () => {
    const user = { id: mockUserId, role: UserRole.STUDENT };

    it('should throw NotFoundException if member not found', async () => {
      model.findOne.mockResolvedValue(null);
      await expect(service.deleteMember(mockMemberId, user)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not authorized', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockMember));
      signalementModel.findOne.mockReturnValue(createMockQuery(null));
      await expect(service.deleteMember(mockMemberId, user)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if signalement status is blocked', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockMember));
      signalementModel.findOne.mockReturnValue(createMockQuery({ ...mockSignalement, status: StatutSignalement.RESOLU }));
      await expect(service.deleteMember(mockMemberId, user)).rejects.toThrow(BadRequestException);
    });

    it('should delete successfully', async () => {
      model.findOne.mockReturnValue(createMockQuery(mockMember));
      signalementModel.findOne.mockReturnValue(createMockQuery(mockSignalement));
      await service.deleteMember(mockMemberId, user);
      expect(mockMember.isDeleted).toBe(true);
      expect(mockMember.save).toHaveBeenCalled();
    });
  });

  describe('synchronizeMembers', () => {
    it('should handle deletions, updates and creations', async () => {
      const members = [
        { _id: '507f1f77bcf86cd799439011', firstName: 'Updated' },
        { firstName: 'New' }
      ] as any;
      const deletedIds = ['507f1f77bcf86cd799439012'];

      await service.synchronizeMembers(mockSignalementId, members, deletedIds);

      expect(model.updateMany).toHaveBeenCalledWith({ _id: { $in: deletedIds }, signalementId: mockSignalementId }, expect.anything());
      expect(model.updateOne).toHaveBeenCalledWith({ _id: new Types.ObjectId('507f1f77bcf86cd799439011'), signalementId: mockSignalementId, isDeleted: false }, expect.anything());
      expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'New', signalementId: mockSignalementId }));
    });
  });

  describe('softDeleteBySignalement', () => {
    it('should updateMany', async () => {
      const date = new Date();
      await service.softDeleteBySignalement(mockSignalementId, date);
      expect(model.updateMany).toHaveBeenCalledWith({ signalementId: mockSignalementId, isDeleted: false }, { isDeleted: true, deletedAt: date });
    });
  });
});
