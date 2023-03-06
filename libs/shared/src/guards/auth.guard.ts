import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AUTH_KEY } from '../decorators/auth.decorator';
import { JwtUser } from '../entities';

type LargeRequest = Request & JwtUser;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.authClient.subscribeToResponseOf('verify-jwt');

    await this.authClient.connect();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as LargeRequest;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!AUTH_KEY) return true;
    if (!authToken) return false;

    try {
      const { user } = await firstValueFrom(this.authClient.send('verify-jwt', { jwt: authToken }));
      req.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
