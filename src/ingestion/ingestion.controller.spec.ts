import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { getModelToken } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs'; // Import RxJS to mock HTTP calls
import { IngestionProcess } from './entities/ingestion.entity';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        IngestionService,
        {
          provide: getModelToken(IngestionProcess),
          useValue: {
            create: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockImplementation(() => of({ data: {} })),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
