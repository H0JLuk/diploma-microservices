import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from 'libs/shared/src/interceptors';

import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor }],
})
export class AppModule {}
