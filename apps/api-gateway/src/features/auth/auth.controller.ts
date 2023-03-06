import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from 'libs/shared/src/decorators';
import { Authorized } from 'libs/shared/src/decorators/auth.decorator';
import { LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';
import { CookieService } from 'libs/shared/src/services/cookie.service';
import { firstValueFrom, Observable } from 'rxjs';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientKafka, private readonly cookieService: CookieService) {}

  async onModuleInit(): Promise<void> {
    this.authClient.subscribeToResponseOf('auth-login');
    this.authClient.subscribeToResponseOf('get-all-users');
    this.authClient.subscribeToResponseOf('registration');
    this.authClient.subscribeToResponseOf('login');

    await this.authClient.connect();
  }

  @Post('registration')
  async registration(@Body() registrationUserDto: RegistrationUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await firstValueFrom(
      this.authClient.send('registration', registrationUserDto),
    );

    this.cookieService.setRefreshToken(res, refreshToken);

    return res.json({
      accessToken,
      user,
    });
  }

  @Post('login')
  async logIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await firstValueFrom(this.authClient.send('login', loginUserDto));

    this.cookieService.setRefreshToken(res, refreshToken);

    return res.json({
      accessToken,
      user,
    });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Student')
  @Get('users')
  getUsers(): Observable<User[]> {
    return this.authClient.send('get-all-users', '');
  }
}
