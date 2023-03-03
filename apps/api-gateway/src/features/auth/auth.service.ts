import { Injectable } from '@nestjs/common';

import { IAuthService } from './auth.adapter';

@Injectable()
export class AuthService implements IAuthService {
  public async getText() {
    return 'Hello World!';
  }
}
