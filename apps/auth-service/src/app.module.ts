import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'libs/shared/src/filters';

import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
