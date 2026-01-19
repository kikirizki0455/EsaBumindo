import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import { ValidationPipe } from '@nestjs/common';

// main.ts
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // PASTIKAN INI BENAR: melayani folder public agar bisa diakses browser
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/',
  });

  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();
