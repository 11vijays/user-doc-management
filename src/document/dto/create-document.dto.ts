import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string; // This will be assigned after upload

  @IsString()
  @IsOptional()
  description?: string;
}
