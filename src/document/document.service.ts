import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { InjectModel } from '@nestjs/sequelize';
import { handlePromise } from '../utils/error/promise-handler';
import { serveBadResponse, serveResponse } from '../utils/helpers';
import { HTTP_METHODS } from '../utils/constant';

@Injectable()
export class DocumentService {
  private readonly entityName = 'document';
  constructor(@InjectModel(Document) private document: typeof Document) {}
  async create(createDocumentDto: CreateDocumentDto, userId: number) {
    const promise = this.document.create({
      ...createDocumentDto,
      userId,
    } as Document);
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.UPLOAD, this.entityName, data);
  }

  async findAll(id?: number) {
    const promise = this.document.findAll();
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.FETCH, this.entityName, data);
  }

  async findOne(id: number) {
    const promise = this.document.findOne({ where: { id: id } });
    const data = await handlePromise(promise);
    if (!data) {
      return serveBadResponse(this.entityName);
    }
    return serveResponse(HTTP_METHODS.FETCH, this.entityName, data);
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    userId: number,
  ) {
    const documentExist = await this.findOne(id);
    if (!documentExist.success) {
      return serveBadResponse(this.entityName);
    }
    const promise = this.document.update(
      {
        ...updateDocumentDto,
        userId,
      } as Document,
      { where: { id: id } },
    );
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.UPDATE, this.entityName, data);
  }

  async remove(id: number) {
    const promise = this.document.destroy({ where: { id: id } });
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.DELETE, this.entityName, data);
  }
}
