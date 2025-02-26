import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { handlePromise } from '../utils/error/promise-handler';
import { serveBadResponse, serveResponse } from '../utils/helpers';
import { HTTP_METHODS } from '../utils/constant';
import { ApiResponse } from '../utils/types';

@Injectable()
export class UserService {
  private readonly entityName = 'User';

  constructor(
    @InjectModel(User)
    private user: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const promise = this.user.create(createUserDto as User);
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.CREATE, this.entityName, data);
  }

  async findAll(): Promise<ApiResponse<User[]>> {
    const promise = this.user.findAll();
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.FETCH, this.entityName, data);
  }

  async findOne(id: string): Promise<ApiResponse<User | null>> {
    const promise = this.user.findByPk(id);
    const user = await handlePromise(promise);
    if (!user) {
      return serveBadResponse(this.entityName);
    }
    return serveResponse(HTTP_METHODS.FETCH, this.entityName, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user?.success) {
      return serveBadResponse(this.entityName);
    }
    const promise = this.user.update(updateUserDto, {
      where: { id: id },
    });
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.MODIFY, this.entityName, data);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user?.success) {
      return serveBadResponse(this.entityName);
    }
    const promise = this.user.destroy({ where: { id: id } });
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.DELETE, this.entityName, data);
  }

  async findByEmail(id: string) {
    const promise = this.user.findOne({ where: { email: id } });
    return await handlePromise(promise);
  }
}
