import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { RoleGaurd } from '../auth/role.gaurd';
import { Roles } from '../decorators';
import { UserRole } from '../utils/constant';

@Controller('document')
@UseGuards(JwtAuthGuard, RoleGaurd)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('/upload')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const { user }: any = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${file?.filename}`;
    const name = file?.originalname?.split('.').slice(0, -1).join('.');
    return this.documentService.create(
      {
        name,
        fileUrl,
        description: createDocumentDto?.description,
      },
      user?.userId,
    );
  }

  @Get('/fetch')
  findAll(@Req() req: Request) {
    const { user }: any = req;
    return this.documentService.findAll(user?.userId);
  }

  @Get('/fetch/:id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user }: any = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = file?.filename
      ? `${baseUrl}/uploads/${file?.filename}`
      : undefined;
    const name = file?.originalname?.split('.').slice(0, -1).join('.');
    return this.documentService.update(
      +id,
      { name, fileUrl, description: updateDocumentDto.description },
      user?.userId,
    );
  }

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
