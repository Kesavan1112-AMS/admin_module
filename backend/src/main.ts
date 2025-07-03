import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 5000;

  // CORS Configuration
  const allowedOrigins = configService.get<string[]>('cors.allowedOrigins') || [
    'http://localhost:5100',
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'userKey',
      'securityKey',
      'sessionId',
      'user_id',
      'session_id',
    ],
  });

  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Apply global interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), new ErrorInterceptor());

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`🚀 Server is running on PORT ${port}`);
  console.log(`📡 Environment: ${configService.get('nodeEnv')}`);
  console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
