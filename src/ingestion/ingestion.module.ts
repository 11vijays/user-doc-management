import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { IngestionProcess } from './entities/ingestion.entity';
import { HttpModule } from '@nestjs/axios'; // ""Correct import

@Module({
  imports: [
    SequelizeModule.forFeature([IngestionProcess]),
    HttpModule.register({}),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
