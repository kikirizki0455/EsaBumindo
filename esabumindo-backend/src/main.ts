import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  // ✅ IMPROVED CORS CONFIGURATION
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  // ✅ GLOBAL VALIDATION PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ SERVE STATIC ASSETS - CRITICAL FOR IMAGES
  // This makes /public/uploads accessible via http://localhost:3001/uploads
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/',
    maxAge: '1d', // Cache for 1 day
    etag: false,
  });

  // ✅ OPTIONAL: Serve uploads folder specifically
  app.useStaticAssets(join(process.cwd(), 'public', 'uploads'), {
    prefix: '/uploads',
    maxAge: '1d',
    etag: false,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`✅ Backend running on http://localhost:${port}`);
    console.log(`📁 Static assets folder: ${join(process.cwd(), 'public')}`);
    console.log(
      `📸 Images accessible at: http://localhost:${port}/uploads/articles/`,
    );
  });
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
