import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { JwtAuthGuard } from 'src/auth/auth.gaurd';
import { RoleGaurd } from 'src/auth/role.gaurd';
import { Roles } from 'src/decorators';
import { UserRole } from 'src/utils/constant';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RoleGaurd)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('/trigger')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() createIngestionDto: CreateIngestionDto) {
    return this.ingestionService.triggerIngestion(createIngestionDto.source);
  }

  @Get('/fetch/:id')
  async getIngestion(@Param('id') id: string) {
    return this.ingestionService.getIngestionById(+id);
  }

  @Roles(UserRole.ADMIN)
  @Post('webhook')
  async updateIngestionStatus(
    @Body()
    body: {
      ingestionId: number;
      status: string;
      resultMessage?: string;
    },
  ) {
    return this.ingestionService.updateIngestionStatus(
      body.ingestionId,
      body.status,
      body.resultMessage,
    );
  }

  @Get('/status/:id')
  async getIngestionStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(+id);
  }

  @Get('/all')
  async getAllIngestions() {
    return this.ingestionService.getAllIngestions();
  }

  @Roles(UserRole.ADMIN)
  @Delete('/delete/:id')
  async deleteingestion(@Param('id') id: string) {
    return this.ingestionService.removeIngestion(+id);
  }
}
