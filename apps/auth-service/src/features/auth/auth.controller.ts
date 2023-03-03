import { Controller, Get } from '@nestjs/common';
import { User } from 'libs/shared/src/entities';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAnything(): User {
    return { email: 'hui', id: 2, name: 'name' };
  }
}
