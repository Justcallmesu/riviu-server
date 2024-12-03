// External Modules
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

// Env Package
config({ path: '.env' });

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:5174',
      'http://localhost:4174',
      'https://riviu-webapp-64lurst7k-justcallmesus-projects.vercel.app',
      'https://riviu-webapp.vercel.app'
    ],
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_SECRET as string));

  await app.listen(3000);
}
bootstrap();
