import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    credentials: true, // needs to be set to true so that browser can store cookie.
    origin: 'http://localhost:3000',
    exposedHeaders: ['set-cookie'],
  });
  await app.listen(5001);
}
bootstrap();
