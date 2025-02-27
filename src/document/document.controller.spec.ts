import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UserRole } from '../utils/constant';
import { Request } from 'express';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DocumentService;

  const mockDocumentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockDocument = {
    id: 1,
    name: 'Test Document',
    fileUrl: 'http://localhost/uploads/test.pdf',
    description: 'Test Description',
    userId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{ provide: DocumentService, useValue: mockDocumentService }],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(documentController).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a document and return its details', async () => {
      const createDocumentDto: CreateDocumentDto = {
        name: 'Test Document',
        fileUrl: 'http://localhost/uploads/test.pdf',
        description: 'Test Description',
      };

      const mockRequest = {
        user: { userId: 1 },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      } as any;

      const mockFile = {
        filename: 'test.pdf',
        originalname: 'test.pdf',
      } as Express.Multer.File;

      mockDocumentService.create.mockResolvedValue(mockDocument);

      const result = await documentController.uploadFile(
        createDocumentDto,
        mockFile,
        mockRequest,
      );

      expect(result).toEqual(mockDocument);
      expect(mockDocumentService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test',
          fileUrl: 'http://localhost/uploads/test.pdf',
          description: 'Test Description',
        }),
        1,
      );
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      mockDocumentService.findAll.mockResolvedValue([mockDocument]);

      const mockRequest = { user: { userId: 1 } } as any;

      const result = await documentController.findAll(mockRequest);

      expect(result).toEqual([mockDocument]);
      expect(mockDocumentService.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      mockDocumentService.findOne.mockResolvedValue(mockDocument);

      const result = await documentController.findOne('1');

      expect(result).toEqual(mockDocument);
      expect(mockDocumentService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDocumentDto: UpdateDocumentDto = {
        description: 'Updated Description',
      };

      const mockRequest = {
        user: { userId: 1 },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      } as any;
      const mockFile = {
        filename: 'test.pdf',
        originalname: 'test.pdf',
      } as Express.Multer.File;

      mockDocumentService.update.mockResolvedValue([1]);

      const result = await documentController.update(
        '1',
        updateDocumentDto,
        mockRequest,
        mockFile,
      );

      expect(result).toEqual([1]);
      expect(mockDocumentService.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ description: 'Updated Description' }),
        1,
      );
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      mockDocumentService.remove.mockResolvedValue(1);

      const result = await documentController.remove('1');

      expect(result).toEqual(1);
      expect(mockDocumentService.remove).toHaveBeenCalledWith(1);
    });
  });
});
