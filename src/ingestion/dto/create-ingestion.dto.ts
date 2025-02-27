import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIngestionDto {
  @IsString()
  @IsNotEmpty()
  source: string;
}

export const INGESTION_MESSAGE = {
  SUCCESS: 'Ingestion successful',
  FAIL: 'Ingestion failed',
};

export enum IngestionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
