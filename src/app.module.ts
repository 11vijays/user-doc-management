import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from './utils/error/exceptions.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: ExceptionsFilter }],
})
export class AppModule {}
