import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    const token = await this.authService.login(createAuthDto);
    return res.status(HttpStatus.OK).send({ success: true, token });
  }
}
