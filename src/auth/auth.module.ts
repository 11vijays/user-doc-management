import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { RoleGaurd } from './role.gaurd';
import rateLimit from 'express-rate-limit'; // ✅ Use default import

dotenv.config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RoleGaurd],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 5, // Limit each IP to 5 requests per windowMs
          message: {
            message: 'Too many login attempts, please try again later.',
            sucess: false,
          },
        }),
      )
      .forRoutes(AuthController);
  }
}
