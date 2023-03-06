import { SetMetadata } from '@nestjs/common';

export const AUTH_KEY = 'auth';
export const Authorized = (needAuthorize = true) => SetMetadata(AUTH_KEY, needAuthorize);
