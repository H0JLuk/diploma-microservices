import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('get-all-users')
  getAllUsers(): Promise<User[]> {
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

  @MessagePattern('refresh')
  refresh(@Payload() { userId, refreshToken }: { userId: User['id']; refreshToken: string }) {
    return this.authService.refresh(userId, refreshToken);
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
