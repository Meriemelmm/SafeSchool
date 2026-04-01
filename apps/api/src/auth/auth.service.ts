import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Private helper: generate access + refresh tokens ───────────────────────
  private generateTokens(user: UserDocument) {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload);

    // Refresh token signed with a different secret and longer expiry
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'super-refresh-secret',
      ),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { access_token, refresh_token };
  }

  // ─── Register ────────────────────────────────────────────────────────────────
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const newUser = await this.usersService.create({ ...registerDto });

    const tokens = this.generateTokens(newUser);
    return {
      ...tokens,
      user: this.usersService.sanitizeUser(newUser),
    };
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password  credentials');
    }

    const tokens = this.generateTokens(user);
    return {
      ...tokens,
      user: this.usersService.sanitizeUser(user),
    };
  }

  // ─── Profile ──────────────────────────────────────────────────────────────────
  async profile(user) {
    const fullUser = await this.usersService.findById(user.id);
    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }
    return {
      user: this.usersService.sanitizeUser(fullUser),
    };
  }
}
