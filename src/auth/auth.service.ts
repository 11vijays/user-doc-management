import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { handlePromise } from '../utils/error/promise-handler';
import * as bcrypt from 'bcrypt';
import { CustomBadException } from '../utils/error/error-handler';
import { AUTH_MESSAGE } from '../utils/constant';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const promise = this.userService.findByEmail(email);
    const data = await handlePromise(promise);
    const user = data?.dataValues;
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(userCred: CreateAuthDto) {
    const user = await this.validateUser(userCred.email, userCred.password);
    if (!user) {
      throw new CustomBadException(
        AUTH_MESSAGE?.USER_NOT_EXIST,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      user: user?.email,
      sub: user?.id,
    };
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }
}
