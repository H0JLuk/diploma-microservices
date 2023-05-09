import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from 'libs/shared/src/filters';

import { SubjectModule } from './features/subject/subject.module';
import { TestModule } from './features/test/test.module';

@Module({
  imports: [ConfigModule.forRoot(), TestModule, SubjectModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpExceptionFilter }],
})
export class AppModule {}
