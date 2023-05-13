import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeInfoUserDto, LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { UserId } from 'libs/shared/src/types';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @MessagePattern('change-info')
  changeInfo(@Payload() changeInfoDto: { userId: UserId } & ChangeInfoUserDto) {
    return this.authService.changeInfo(changeInfoDto);
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
