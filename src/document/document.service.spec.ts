import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { getModelToken } from '@nestjs/sequelize';

describe('DocumentService', () => {
  let service: DocumentService;
  let documentModel: typeof Document;

  beforeEach(async () => {
    const mockDocumentRepository = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: getModelToken(Document), useValue: mockDocumentRepository },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentModel = module.get<typeof Document>(getModelToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
