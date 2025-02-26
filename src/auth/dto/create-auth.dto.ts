import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface JwtPayload {
  user: string;
  sub: string;
  iat: number;
  exp: number;
  version: string;
}
