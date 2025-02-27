import { Injectable } from '@nestjs/common';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { IngestionProcess } from './entities/ingestion.entity';
import { InjectModel } from '@nestjs/sequelize';
import { handlePromise } from '../utils/error/promise-handler';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { serveBadResponse, serveResponse } from '../utils/helpers';
import { HTTP_METHODS } from '../utils/constant';
import { INGESTION_MESSAGE, IngestionStatus } from './dto/create-ingestion.dto';
import { ApiResponse } from '../utils/types';

const pythonURI = process.env.EXTERNAL_INGESTION_API || '';

@Injectable()
export class IngestionService {
  private readonly entity = 'Ingestion';
  constructor(
    @InjectModel(IngestionProcess) private ingestion: typeof IngestionProcess,
    private readonly httpService: HttpService,
  ) {}
  async triggerIngestion(
    source: string,
  ): Promise<ApiResponse<IngestionProcess>> {
    const promise = this.ingestion.create({
      source,
      status: IngestionStatus.PENDING,
    } as IngestionProcess);
    const ingestion = await handlePromise(promise);
    try {
      await lastValueFrom(
        this.httpService.post(pythonURI, {
          ingestionId: ingestion.id,
          source,
          //in case of python webapis
          // webhookUrl: 'http://localhost:5000/ingestion/webhook',
        }),
      );
      await ingestion.update({ status: IngestionStatus.IN_PROGRESS });
      setTimeout(async () => {
        await ingestion.update({
          status: IngestionStatus.COMPLETED,
          resultMessage: INGESTION_MESSAGE.SUCCESS,
        });
      }, 5000);
      return serveResponse(HTTP_METHODS.CREATE, this.entity, ingestion);
    } catch (error: any) {
      await ingestion.update({
        status: IngestionStatus.FAILED,
        resultMessage: INGESTION_MESSAGE.FAIL,
      });
      return {
        message: INGESTION_MESSAGE.FAIL,
        error: error.message,
        success: false,
      };
    }
  }

  async getIngestionById(id: number): Promise<ApiResponse<IngestionProcess>> {
    const ingestion = await this.ingestion.findByPk(id);
    if (!ingestion) {
      return serveBadResponse(this.entity);
    }
    return serveResponse(HTTP_METHODS.FETCH, this.entity, ingestion);
  }

  async updateIngestionStatus(
    ingestionId: number,
    status: string,
    resultMessage?: string,
  ): Promise<ApiResponse<{}>> {
    const ingestion = await this.ingestion.findByPk(ingestionId);
    if (!ingestion) {
      return serveBadResponse(this.entity);
    }
    await ingestion.update({ status, resultMessage } as IngestionProcess);
    return serveResponse(HTTP_METHODS.UPDATE, this.entity, ingestionId);
  }
  async getIngestionStatus(id: number): Promise<ApiResponse<{}>> {
    const ingestion = await this.getIngestionById(id);
    if (!ingestion.success) {
      return serveBadResponse(this.entity);
    }
    return serveResponse(HTTP_METHODS.FETCH, this.entity, {
      status: ingestion?.data?.status,
    });
  }

  async getAllIngestions(): Promise<ApiResponse<IngestionProcess[]>> {
    const promise = this.ingestion.findAll();
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.FETCH, this.entity, data);
  }

  async removeIngestion(id: number) {
    const ingestion = await this.getIngestionById(id);
    if (!ingestion.success) {
      return serveBadResponse(this.entity);
    }
    const promise = this.ingestion.destroy({ where: { id: id } });
    const data = await handlePromise(promise);
    return serveResponse(HTTP_METHODS.DELETE, this.entity, data);
  }
}
