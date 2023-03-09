import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from 'libs/shared/src/interceptors';

import { TestModule } from './features/test/test.module';

@Module({
  imports: [ConfigModule.forRoot(), TestModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor }],
})
export class AppModule {}
