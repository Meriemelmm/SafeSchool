import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with credentials
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Activating global validation pipes (Best Practice)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out properties that don't have decorators
    transform: true, // Automatically parse primitive types
  }));

  await app.listen(process.env.PORT ?? 3007);
}
bootstrap();
