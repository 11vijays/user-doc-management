import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { RoleGaurd } from '../auth/role.gaurd';
import { Roles } from '../decorators';
import { AUTH_MESSAGE, UserRole } from '../utils/constant';
import { Request } from 'express';

@Controller('user')
@UseGuards(JwtAuthGuard, RoleGaurd)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/fetch/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const { user }: any = req;
    if (user?.role === UserRole.EDITOR && updateUserDto?.role) {
      throw new ForbiddenException(AUTH_MESSAGE.EDITOR_PERMISSION_ERROR);
    }
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
