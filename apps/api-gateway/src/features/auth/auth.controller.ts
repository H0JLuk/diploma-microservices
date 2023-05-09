import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Authorized, Roles } from 'libs/shared/src/decorators';
import { LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';
import { CookieService } from 'libs/shared/src/services/cookie.service';
import { firstValueFrom, Observable } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientKafka, private readonly cookieService: CookieService) {}

  async onModuleInit(): Promise<void> {
    this.authClient.subscribeToResponseOf('get-all-users');
    this.authClient.subscribeToResponseOf('check-current-user');
    this.authClient.subscribeToResponseOf('registration');
    this.authClient.subscribeToResponseOf('login');
    this.authClient.subscribeToResponseOf('refresh');
    this.authClient.subscribeToResponseOf('sign-out');

    await this.authClient.connect();
  }

  @Get('current-user')
  async checkAuth(@Req() req: Request) {
    const accessToken = this.cookieService.getAccessToken(req);
    const refreshToken = this.cookieService.getRefreshToken(req);

    return this.authClient.send('check-current-user', { accessToken, refreshToken });
  }

  @Post('registration')
  async registration(@Body() registrationUserDto: RegistrationUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await firstValueFrom(
      this.authClient.send('registration', registrationUserDto),
    );

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);
    return res.json({ status: 'Signed up' });
  }

  @Post('login')
  async logIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await firstValueFrom(this.authClient.send('login', loginUserDto));

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return res.json({ status: 'Logged in' });
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = this.cookieService.getRefreshToken(req);

    const { user, accessToken, refreshToken } = await firstValueFrom(
      this.authClient.send('refresh', { refreshToken: oldRefreshToken }),
    );

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);
    return res.json({ status: 'Tokens have refreshed' });
  }

  @ApiBearerAuth()
  @Authorized()
  @Post('sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const refreshToken = this.cookieService.getRefreshToken(req);
    await firstValueFrom(this.authClient.send('sign-out', { refreshToken }));
    this.cookieService.clearAllTokens(res);
    return res.json({ status: 'Logged out' });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Get('users')
  getUsers(): Observable<User[]> {
    return this.authClient.send('get-all-users', '');
  }
}
