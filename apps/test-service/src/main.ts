import { HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './exceptions/prisma.exception-filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:29092'],
      },
      consumer: {
        groupId: 'test-consumer',
      },
    },
  });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2022: HttpStatus.BAD_REQUEST,
    }),
  );

  await app.listen();

  Logger.log(`🚀 Test-microservice is running!`);
}

bootstrap();
