import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.setGlobalPrefix('api/v1/');
  app.use(helmet());
  app.enableCors();
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
