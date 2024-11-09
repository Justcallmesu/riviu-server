// External Modules
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

// Env Package
config({ path: '.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
async function bootstrap() {
  console.log(process.env.DB_TYPE);
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.cookie_secret as string));

  await app.listen(3000);
}
bootstrap();
