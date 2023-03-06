import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('get-all-users')
  getAllUsers(): Prisma.PrismaPromise<User[]> {
    return this.authService.getAllUsers();
  }

  @MessagePattern('registration')
  registration(@Payload() registrationUserDto: RegistrationUserDto) {
    return this.authService.registration(registrationUserDto);
  }

  @MessagePattern('login')
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('verify-jwt')
  verifyJwt(@Payload('jwt') jwt: string) {
    return this.authService.verifyJwt(jwt);
  }

  @MessagePattern('decode-jwt')
  decodeJwt(@Payload('jwt') jwt: string) {
    return this.authService.getUserFromHeader(jwt);
  }
}
