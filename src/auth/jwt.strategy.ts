import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './dto/create-auth.dto';
import * as dotenv from 'dotenv';
import { AUTH_MESSAGE } from '../utils/constant';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: false,
    };
    super(options);
  }

  async validate(payload: JwtPayload) {
    const data = await this.userService.findByEmail(payload?.user);
    const user = data?.dataValues;
    if (!user) throw new UnauthorizedException(AUTH_MESSAGE.USER_NOT_FOUND);
    if (Number(payload.version) !== user.tokenVersion) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_EXPIRED);
    }
    return { userId: payload.sub, email: payload.user, role: user?.role };
  }
}
