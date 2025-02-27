import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { IngestionProcess } from './entities/ingestion.entity';
import { getModelToken } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IngestionStatus } from './dto/create-ingestion.dto';

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'), // Keep the rest of RxJS unchanged
  lastValueFrom: jest.fn().mockResolvedValue({}), // Properly mock lastValueFrom
}));

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let httpService: HttpService;

  const mockIngestionModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  };

  const mockIngestion = {
    id: 1,
    source: 'test_source',
    status: 'pending',
    resultMessage: null,
  };

  const mockHttpService = {
    post: jest.fn().mockReturnValue({
      toPromise: jest.fn().mockResolvedValue({}),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getModelToken(IngestionProcess),
          useValue: mockIngestionModel,
        },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    ingestionService = module.get<IngestionService>(IngestionService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(ingestionService).toBeDefined();
  });

  describe('triggerIngestion', () => {
    it('should create an ingestion record and trigger ingestion', async () => {
      const mockIngestion = {
        id: 1,
        source: 'test_source',
        status: 'pending',
        resultMessage: null,
        update: jest.fn().mockResolvedValue({}), // ""Add update method
      };

      mockIngestionModel.create.mockResolvedValue(mockIngestion);

      const result = await ingestionService.triggerIngestion('test_source');

      expect(result.data).toMatchObject(mockIngestion);
      expect(mockIngestion.update).toHaveBeenCalledWith({
        status: IngestionStatus.IN_PROGRESS,
      });

      expect(mockIngestionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'test_source',
          status: IngestionStatus.PENDING,
        }),
      );
    });
  });

  describe('getIngestionById', () => {
    it('should return an ingestion record by ID', async () => {
      mockIngestionModel.findByPk.mockResolvedValue(mockIngestion);

      const result = await ingestionService.getIngestionById(1);
      expect(result.data).toEqual(mockIngestion);
      expect(mockIngestionModel.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('updateIngestionStatus', () => {
    it('should update ingestion status', async () => {
      const mockIngestion = {
        id: 1,
        source: 'test_source',
        status: 'pending',
        resultMessage: null,
        update: jest.fn().mockResolvedValue({}), // ""Add update method
      };

      mockIngestionModel.findByPk.mockResolvedValue(mockIngestion);

      const result = await ingestionService.updateIngestionStatus(
        1,
        'completed',
        'Success',
      );

      expect(result.success).toBe(true);
      expect(mockIngestion.update).toHaveBeenCalledWith({
        status: 'completed',
        resultMessage: 'Success',
      });
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion status', async () => {
      mockIngestionModel.findByPk.mockResolvedValue(mockIngestion);

      const result = await ingestionService.getIngestionStatus(1);
      expect(result.data).toEqual({ status: 'pending' });
    });
  });

  describe('getAllIngestions', () => {
    it('should return all ingestion records', async () => {
      mockIngestionModel.findAll.mockResolvedValue([mockIngestion]);

      const result = await ingestionService.getAllIngestions();
      expect(result.data).toEqual([mockIngestion]);
      expect(mockIngestionModel.findAll).toHaveBeenCalled();
    });
  });

  describe('removeIngestion', () => {
    it('should delete an ingestion record', async () => {
      mockIngestionModel.destroy.mockResolvedValue(1);

      const result = await ingestionService.removeIngestion(1);
      expect(result.success).toBe(true);
      expect(mockIngestionModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
