import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from './utils/error/exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    DocumentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: ExceptionsFilter }],
})
export class AppModule {}
