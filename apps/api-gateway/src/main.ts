import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DEFAULT_TAG, SWAGGER_API_ROOT } from 'libs/utils/documentation/constants';

import { AppModule } from './features/app/app.module';

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('API-GATEWAY')
    .setDescription('api-gateway service')
    .setVersion('1.0')
    .addTag(DEFAULT_TAG)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);

  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}`);
}
bootstrap();
