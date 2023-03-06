import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientKafka } from '@nestjs/microservices';
import { ErrorMessages } from 'libs/utils/documentation/constants';
import { firstValueFrom } from 'rxjs';

import { AUTH_KEY } from '../decorators/auth.decorator';
import { AppRequest } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientKafka, private reflector: Reflector) {}

  async onModuleInit(): Promise<void> {
    this.authClient.subscribeToResponseOf('verify-jwt');

    await this.authClient.connect();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AppRequest = context.switchToHttp().getRequest();
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    const isNeedAuth = this.reflector.get<boolean>(AUTH_KEY, context.getHandler());

    if (!isNeedAuth) return true;
    if (!authToken) throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);

    try {
      const { user } = await firstValueFrom(this.authClient.send('verify-jwt', { jwt: authToken }));
      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
  }
}
