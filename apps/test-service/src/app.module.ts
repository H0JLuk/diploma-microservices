import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'libs/shared/src/filters';

import { SubjectModule } from './features/subject/subject.module';
import { TestModule } from './features/test/test.module';
import { TestHistoryModule } from './features/test-history/test-history.module';

@Module({
  imports: [ConfigModule.forRoot(), TestModule, SubjectModule, TestHistoryModule],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
