import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Authorized, CurrentUser, Roles, TCurrentUser } from 'libs/shared/src/decorators';
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
    this.authClient.subscribeToResponseOf('refresh');
    this.authClient.subscribeToResponseOf('sign-out');

    await this.authClient.connect();
  }

  @Post('registration')
  async registration(@Body() registrationUserDto: RegistrationUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await firstValueFrom(
      this.authClient.send('registration', registrationUserDto),
    );

    this.cookieService.setRefreshToken(res, refreshToken);
    return res.json({ accessToken, user });
  }

  @Post('login')
  async logIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await firstValueFrom(this.authClient.send('login', loginUserDto));

    this.cookieService.setRefreshToken(res, refreshToken);

    return res.json({ accessToken, user });
  }

  @Post('refresh')
  async refreshTokens(@CurrentUser('id') userId: TCurrentUser['id'], @Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = this.cookieService.getRefreshToken(req);

    const { user, accessToken, refreshToken } = await firstValueFrom(
      this.authClient.send('refresh', { userId, refreshToken: oldRefreshToken }),
    );

    this.cookieService.setRefreshToken(res, refreshToken);
    return res.json({ accessToken, user });
  }

  @Post('sign-out')
  async signOut(@CurrentUser('id') userId: TCurrentUser['id'], @Req() req: Request, @Res() res: Response) {
    const refreshToken = this.cookieService.getRefreshToken(req);
    await firstValueFrom(this.authClient.send('sign-out', { refreshToken }));
    this.cookieService.clearAllTokens(res);
    res.sendStatus(200);
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Get('users')
  getUsers(): Observable<User[]> {
    return this.authClient.send('get-all-users', '');
  }
}
