import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { ErrorMessages } from 'libs/utils/documentation/constants';
import { JwtUser } from '../entities';
import { AppRequest } from '../types';

export type TCurrentUser = JwtUser['user'];

export const CurrentUser = createParamDecorator(async (data: keyof TCurrentUser, context: ExecutionContext) => {
  const { user }: AppRequest = context.switchToHttp().getRequest();

  if (!user) throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);

  return data ? user[data] : user;
});
