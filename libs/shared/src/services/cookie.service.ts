import { Injectable } from '@nestjs/common';
import { CookieOptions, Response, Request } from 'express';

@Injectable()
export class CookieService {
  private HOUR = 3_600_000;
  private MAX_AGE_15_MIN = this.HOUR / 4;
  private MAX_AGE_1_DAY = this.HOUR * 24;
  private MAX_AGE_30_DAYS = this.MAX_AGE_1_DAY * 30;

  private isProd = process.env.NODE_ENV === 'production';

  private ACCESS_TOKEN_NAME = 'access-token';
  private get REFRESH_TOKEN_NAME() {
    if (this.isProd) return '__Secure-refresh-token';
    return 'refresh-token';
  }

  private get defaultOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';

    return {
      httpOnly: isProd,
      secure: isProd,
      maxAge: this.MAX_AGE_15_MIN,
    };
  }

  private get accessTokenOptions(): CookieOptions {
    return { ...this.defaultOptions };
  }

  private get refreshTokenOptions(): CookieOptions {
    return {
      ...this.defaultOptions,
      maxAge: this.MAX_AGE_30_DAYS,
    };
  }

  getAccessToken(req: Request): string | undefined {
    // const header = req.header('Authorization');
    // if (header) {
    //   return header.replace('Bearer ', '');
    // }

    return req.cookies[this.ACCESS_TOKEN_NAME];
  }

  getRefreshToken(req: Request): string | undefined {
    return req.cookies[this.REFRESH_TOKEN_NAME];
  }

  setAccessToken(res: Response, token: string): void {
    // res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie(this.ACCESS_TOKEN_NAME, token, this.accessTokenOptions);
  }

  setRefreshToken(res: Response, token: string): void {
    res.cookie(this.REFRESH_TOKEN_NAME, token, this.refreshTokenOptions);
  }

  clearAllTokens(res: Response): void {
    res.clearCookie(this.ACCESS_TOKEN_NAME, this.accessTokenOptions);
    res.clearCookie(this.REFRESH_TOKEN_NAME, this.refreshTokenOptions);
  }
}
