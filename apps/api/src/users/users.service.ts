import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { UserDto } from './dto/users.dto';
import * as crypto from 'crypto';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private readonly mailService: MailService,
  ) {}
  private generatePassword(length: number = 12): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const bytes = crypto.randomBytes(length);

    return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    if (userData.password) {
      const salt = parseInt(
        this.configService.get<string>('BCRYPT_SALT', '10'),
        10,
      );
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const newUser = new this.userModel(userData);

    if (userData.profileData) {
      newUser.markModified('profileData');
    }

    return newUser.save();
  }

  sanitizeUser(user: UserDocument): Omit<User, 'password'> {
    const userObj = user.toObject({ virtuals: true, getters: true });
    const { password, ...sanitized } = userObj;
    return sanitized;
  }

  async findAll(
    filter: any = {},
    skip: number = 0,
    limit: number = 10,
  ): Promise<{ data: UserDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);
    return { data, total };
  }

  async softDelete(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }
  async createByAdmin(userData: UserDto): Promise<Omit<User, 'password'>> {
    const plainPassword = this.generatePassword();

    const data = { ...userData, password: plainPassword };

    const user = await this.create(data);
    await this.mailService.sendUserWelcome(user, plainPassword);

    return this.sanitizeUser(user);
  }
}
