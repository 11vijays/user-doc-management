import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { getModelToken } from '@nestjs/sequelize';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { HTTP_METHODS } from '../utils/constant';

describe('DocumentService', () => {
  let documentService: DocumentService;

  const mockDocumentModel = {
    bulkCreate: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
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
      providers: [
        DocumentService,
        { provide: getModelToken(Document), useValue: mockDocumentModel },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(documentService).toBeDefined();
  });

  describe('bulkCreate', () => {
    it('should create multiple documents', async () => {
      const createDocumentsDto: CreateDocumentDto[] = [mockDocument];
      mockDocumentModel.bulkCreate.mockResolvedValue(createDocumentsDto);

      const result = await documentService.bulkCreate(createDocumentsDto);

      expect(result).toEqual({
        success: true,
        message: `document uploaded successfully`,
        data: createDocumentsDto,
      });

      expect(mockDocumentModel.bulkCreate).toHaveBeenCalledWith(
        createDocumentsDto,
      );
    });
  });

  describe('create', () => {
    it('should create a document', async () => {
      const createDocumentDto: CreateDocumentDto = { ...mockDocument };
      mockDocumentModel.create.mockResolvedValue(mockDocument);

      const result = await documentService.create(createDocumentDto, 1);

      expect(result).toEqual({
        success: true,
        message: `document uploaded successfully`,
        data: mockDocument,
      });

      expect(mockDocumentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ ...createDocumentDto, userId: 1 }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      mockDocumentModel.findAll.mockResolvedValue([mockDocument]);

      const result = await documentService.findAll();

      expect(result).toEqual({
        success: true,
        message: `document retrieved successfully`,
        data: [mockDocument],
      });

      expect(mockDocumentModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      mockDocumentModel.findOne.mockResolvedValue(mockDocument);

      const result = await documentService.findOne(1);

      expect(result).toEqual({
        success: true,
        message: `document retrieved successfully`,
        data: mockDocument,
      });

      expect(mockDocumentModel.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDocumentDto: UpdateDocumentDto = {
        description: 'Updated Description',
      };

      mockDocumentModel.update.mockResolvedValue([1]);

      const result = await documentService.update(1, updateDocumentDto, 1);

      expect(result).toEqual({
        success: true,
        message: `document updated successfully`,
        data: [1],
      });

      expect(mockDocumentModel.update).toHaveBeenCalledWith(
        expect.objectContaining(updateDocumentDto),
        { where: { id: 1 } },
      );
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      mockDocumentModel.destroy.mockResolvedValue(1);

      const result = await documentService.remove(1);

      expect(result).toEqual({
        success: true,
        message: 'document deleted successfully',
        data: 1,
      });

      expect(mockDocumentModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
