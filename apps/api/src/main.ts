import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activating global validation pipes (Best Practice)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out properties that don't have decorators
    transform: true, // Automatically parse primitive types
  }));

  await app.listen(process.env.PORT ?? 3007);

}
bootstrap();

