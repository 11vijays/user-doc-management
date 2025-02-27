import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { UserRole } from '../utils/constant';

describe('IngestionController', () => {
  let ingestionController: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
    getIngestionById: jest.fn(),
    updateIngestionStatus: jest.fn(),
    getIngestionStatus: jest.fn(),
    getAllIngestions: jest.fn(),
    removeIngestion: jest.fn(),
  };

  const mockIngestion = {
    id: 1,
    source: 'test_source',
    status: 'pending',
    resultMessage: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        { provide: IngestionService, useValue: mockIngestionService },
      ],
    }).compile();

    ingestionController = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(ingestionController).toBeDefined();
  });

  describe('create', () => {
    it('should trigger ingestion and return ingestion data', async () => {
      const createIngestionDto: CreateIngestionDto = { source: 'test_source' };
      mockIngestionService.triggerIngestion.mockResolvedValue(mockIngestion);

      const result = await ingestionController.create(createIngestionDto);
      expect(result).toEqual(mockIngestion);
      expect(mockIngestionService.triggerIngestion).toHaveBeenCalledWith(
        'test_source',
      );
    });
  });

  describe('getIngestion', () => {
    it('should return ingestion data by ID', async () => {
      mockIngestionService.getIngestionById.mockResolvedValue(mockIngestion);

      const result = await ingestionController.getIngestion('1');
      expect(result).toEqual(mockIngestion);
      expect(mockIngestionService.getIngestionById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateIngestionStatus', () => {
    it('should update ingestion status', async () => {
      const updatePayload = {
        ingestionId: 1,
        status: 'completed',
        resultMessage: 'Success',
      };
      mockIngestionService.updateIngestionStatus.mockResolvedValue({
        success: true,
      });

      const result =
        await ingestionController.updateIngestionStatus(updatePayload);
      expect(result).toEqual({ success: true });
      expect(mockIngestionService.updateIngestionStatus).toHaveBeenCalledWith(
        1,
        'completed',
        'Success',
      );
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion status', async () => {
      mockIngestionService.getIngestionStatus.mockResolvedValue({
        status: 'completed',
      });

      const result = await ingestionController.getIngestionStatus('1');
      expect(result).toEqual({ status: 'completed' });
      expect(mockIngestionService.getIngestionStatus).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllIngestions', () => {
    it('should return all ingestion records', async () => {
      mockIngestionService.getAllIngestions.mockResolvedValue([mockIngestion]);

      const result = await ingestionController.getAllIngestions();
      expect(result).toEqual([mockIngestion]);
      expect(mockIngestionService.getAllIngestions).toHaveBeenCalled();
    });
  });

  describe('deleteIngestion', () => {
    it('should delete an ingestion record', async () => {
      mockIngestionService.removeIngestion.mockResolvedValue({ success: true });

      const result = await ingestionController.deleteingestion('1');
      expect(result).toEqual({ success: true });
      expect(mockIngestionService.removeIngestion).toHaveBeenCalledWith(1);
    });
  });
});
