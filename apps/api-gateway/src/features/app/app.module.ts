import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard, RolesGuard } from 'libs/shared/src/guards';
import { ErrorsInterceptor, TimeoutInterceptor } from 'libs/shared/src/interceptors';
import { CookieService } from 'libs/shared/src/services/cookie.service';

import { AnswerController } from '../answer/answer.controller';
import { AuthController } from '../auth/auth.controller';
import { QuestionController } from '../question/question.controller';
import { SubjectController } from '../subject/subject.controller';
import { TestController } from '../test/test.controller';
import { TestHistoryController } from '../test-history/test-history.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
      {
        name: 'TEST_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'test',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'test-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    TestController,
    QuestionController,
    AnswerController,
    TestHistoryController,
    SubjectController,
  ],
  providers: [
    CookieService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
})
export class AppModule {}
