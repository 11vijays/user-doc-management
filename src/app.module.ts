import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
