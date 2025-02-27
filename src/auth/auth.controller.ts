import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth.gaurd';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    const token = await this.authService.login(createAuthDto);
    return res.status(HttpStatus.OK).send({ success: true, token });
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const { user }: any = req;
    return this.authService.logout(user?.userId);
  }
}
