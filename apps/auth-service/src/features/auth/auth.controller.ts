import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('get-all-users')
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @MessagePattern('check-current-user')
  async checkAuth(@Payload() tokens: { accessToken: string; refreshToken: string }) {
    return this.authService.checkAuth(tokens);
  }

  @MessagePattern('registration')
  registration(@Payload() registrationUserDto: RegistrationUserDto) {
    return this.authService.registration(registrationUserDto);
  }

  @MessagePattern('login')
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() { refreshToken }: { refreshToken: string }) {
    return this.authService.refresh(refreshToken);
  }

  @MessagePattern('sign-out')
  signOut(@Payload('refreshToken') refreshToken: string) {
    return this.authService.signOut(refreshToken);
  }

  @MessagePattern('verify-jwt')
  verifyJwt(@Payload('jwt') jwt: string) {
    return this.authService.verifyJwt(jwt);
  }
}
