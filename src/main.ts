import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      allowedHeaders: '*',
      maxAge: 3600,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SoundGlide - API')
    .addBearerAuth()
    .build();

  const swagger = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api', app, swagger);

  const PORT = 3000;

  await app.listen(PORT, () => {
    Logger.warn(`Server started on http://localhost:${PORT}`);
  });
}

bootstrap();
