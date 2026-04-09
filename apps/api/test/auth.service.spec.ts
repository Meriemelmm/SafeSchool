import { Test, TestingModule } from '@nestjs/testing';
console.log('--- AUTH SPEC LOADED ---');
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;
  let configService: any;

  const mockUser = {
    _id: 'user-1',
    email: 'test@example.com',
    password: 'hashed-password',
    role: 'STUDENT',
    isDeleted: false,
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
      sanitizeUser: jest
        .fn()
        .mockImplementation((u) => ({ email: u.email, role: u.role })),
      findById: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    configService = {
      get: jest.fn().mockReturnValue('config-val'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      await expect(
        service.register({ email: 'test@example.com' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register successfully and return tokens', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
      } as any);

      expect(usersService.create).toHaveBeenCalled();
      expect(result.access_token).toBeDefined();
      expect(result.user).toBeDefined();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'a@a.com', password: 'p' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is deleted', async () => {
      usersService.findOneByEmail.mockResolvedValue({
        ...mockUser,
        isDeleted: true,
      });
      await expect(
        service.login({ email: 'a@a.com', password: 'p' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'a@a.com', password: 'wrong' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should login successfully and return tokens', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'a@a.com',
        password: 'pass',
      } as any);

      expect(result.access_token).toBe('mock-token');
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('profile', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findById.mockResolvedValue(null);
      await expect(service.profile({ id: 'u1' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return profile successfully', async () => {
      usersService.findById.mockResolvedValue(mockUser);
      const result = await service.profile({ id: 'u1' });
      expect(result.user.email).toBe(mockUser.email);
    });
  });
});
