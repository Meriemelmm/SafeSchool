import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-me',
    });
  }

  async validate(payload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.isDeleted) {
      throw new UnauthorizedException('User account has been deleted');
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
