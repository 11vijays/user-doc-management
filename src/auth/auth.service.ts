import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { handlePromise } from '../utils/error/promise-handler';
import * as bcrypt from 'bcrypt';
import { CustomBadException } from '../utils/error/error-handler';
import { AUTH_MESSAGE } from '../utils/constant';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiResponse } from '../utils/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return await this.userService.create(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const promise = this.userService.findByEmail(email);
    const data = await handlePromise(promise);
    const user = data?.dataValues;
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(userCred: CreateAuthDto): Promise<string> {
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
      version: user?.tokenVersion,
    };
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }

  async logout(id: number): Promise<ApiResponse<null>> {
    await this.userService.updateTokenVersion(id);
    return { success: true, message: AUTH_MESSAGE.LOGOUT };
  }
}
