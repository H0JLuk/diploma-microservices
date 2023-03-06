import { Injectable } from '@nestjs/common';
import { CookieOptions, Response, Request } from 'express';

// const ACCESS_TOKEN_NAME = 'access-token';
const REFRESH_TOKEN_NAME = '__Host-refresh-token';

@Injectable()
export class CookieService {
  private HOUR = 3_600_000;
  private MAX_AGE_15_MIN = this.HOUR / 4;
  private MAX_AGE_1_DAY = this.HOUR * 24;
  private MAX_AGE_30_DAYS = this.MAX_AGE_1_DAY * 30;

  private get defaultOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    // TODO: здесь не видит .env пачмута((

    if (!process.env.NODE_ENV) {
      console.log('HERE!!!', process.env);
      throw new Error('ебобаный .env не видит(((');
    }

    return {
      httpOnly: isProd,
      secure: isProd,
      maxAge: isProd ? this.MAX_AGE_15_MIN : this.MAX_AGE_30_DAYS,
      sameSite: isProd ? 'lax' : 'none',
    };
  }

  // private get accessTokenOptions(): CookieOptions {
  //   return { ...this.defaultOptions };
  // }

  private get refreshTokenOptions(): CookieOptions {
    return {
      ...this.defaultOptions,
      maxAge: this.MAX_AGE_30_DAYS,
    };
  }

  getAccessToken(req: Request): string | undefined {
    const header = req.header('Authorization');
    if (header) {
      return header.replace('Bearer ', '');
    }

    // const tokenName = ACCESS_TOKEN_NAME;
    // return req.cookies[tokenName];
  }

  getRefreshToken(req: Request) {
    const tokenName = REFRESH_TOKEN_NAME;
    return req.cookies[tokenName];
  }

  setAccessToken(res: Response, token: string) {
    res.setHeader('Authorization', `Bearer ${token}`);
    // res.cookie(ACCESS_TOKEN_ADMIN_NAME, token, this.accessTokenOptions);
  }

  setRefreshToken(res: Response, token: string) {
    const tokenName = REFRESH_TOKEN_NAME;
    res.cookie(tokenName, token, this.refreshTokenOptions);
  }

  clearAllTokens(res: Response) {
    // res.clearCookie(ACCESS_TOKEN_NAME, this.accessTokenOptions);
    res.clearCookie(REFRESH_TOKEN_NAME, this.refreshTokenOptions);
  }
}
