import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangeInfoUserDto, LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { JwtInfo, JwtUser, User } from 'libs/shared/src/entities';
import { UserId } from 'libs/shared/src/types';
import { ErrorMessages } from 'libs/utils/documentation/constants';

import { PrismaService } from '../prisma/prisma.service';

const userSelectFromDB = {
  id: true,
  login: true,
  name: true,
  isActivated: true,
  role: true,
};

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

  public async checkAuth(tokens: { accessToken: string; refreshToken: string }) {
    const [accessTokenInfo, refreshTokenInfo] = await Promise.all([
      this.verifyJwt(tokens.accessToken),
      this.verifyJwt(tokens.refreshToken),
    ]);

    if (
      accessTokenInfo?.user.id !== refreshTokenInfo?.user.id ||
      accessTokenInfo.user.role !== refreshTokenInfo.user.role
    ) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    return this.prismaService.user.findFirstOrThrow({
      select: userSelectFromDB,
      where: { id: accessTokenInfo.user.id, deleted: false },
    });
  }

  public async registration({ login, name, password }: RegistrationUserDto) {
    const candidateUser = await this.prismaService.user.findUnique({ where: { login } });

    if (candidateUser) {
      throw new BadRequestException('Пользователь с таким логином уже существует!');
    }

    const hashPassword = await bcrypt.hash(password, process.env.PASSWORD_SALT);

    const user = await this.prismaService.user.create({
      data: {
        login,
        name,
        password: hashPassword,
        role: 'Student',
      },
      select: userSelectFromDB,
    });
    const { accessToken, refreshToken } = await this.generateAndStoreTokens(user);
    return { user, accessToken, refreshToken };
  }

  public async login({ login, password }: LoginUserDto) {
    const foundUser = await this.prismaService.user.findFirst({
      where: { login, deleted: false },
      select: { ...userSelectFromDB, password: true },
    });

    if (!foundUser) {
      throw new BadRequestException('Пользователя с таким логином не существует!');
    }

    const { password: hashPassword, ...user } = foundUser;

    const isEqual = await this.comparePassword(password, hashPassword);

    if (!isEqual) {
      throw new BadRequestException('Неправильный пароль');
    }

    const { accessToken, refreshToken } = await this.generateAndStoreTokens(user);
    return { user, accessToken, refreshToken };
  }

  public async refresh(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    const userData = await this.decodeToken(oldRefreshToken);
    const tokenFromDB = await this.prismaService.token.findUnique({
      where: { refresh_token: oldRefreshToken },
      include: { user: true },
    });

    if (!userData || !tokenFromDB) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    await this.prismaService.token.delete({ where: { refresh_token: oldRefreshToken } });
    const { accessToken, refreshToken } = await this.generateAndStoreTokens({
      id: tokenFromDB.user.id,
      role: tokenFromDB.user.role,
    });

    const userFullInfo = await this.prismaService.user.findFirst({ where: { id: userData.user.id, deleted: false } });

    return { accessToken, refreshToken, user: userFullInfo };
  }

  public async changeInfo({
    userId,
    name,
    newPassword,
    oldPassword,
  }: ChangeInfoUserDto & { userId: UserId }): Promise<void> {
    const dataForUpdate: Partial<User> = { name };

    if (oldPassword && newPassword) {
      const candidateUser = await this.prismaService.user.findFirst({ where: { id: userId, deleted: false } });

      const isPasswordMatches = candidateUser && (await this.comparePassword(oldPassword, candidateUser.password));

      if (!isPasswordMatches) {
        throw new BadRequestException('Неверный пароль');
      }
      const newPasswordHash = await this.hashPassword(newPassword);
      dataForUpdate.password = newPasswordHash;
    }

    await this.prismaService.user.update({ where: { id: userId }, data: dataForUpdate });
  }

  public async signOut(refreshToken: string): Promise<void> {
    await this.prismaService.token.delete({ where: { refresh_token: refreshToken } });
  }

  public async verifyJwt(jwtToken: string) {
    try {
      const { user } = await this.jwtService.verifyAsync<JwtInfo>(jwtToken);
      return { user };
    } catch {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
  }

  private async decodeToken(jwt: string): Promise<JwtInfo> {
    try {
      return this.jwtService.decode(jwt) as JwtInfo;
    } catch {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
  }

  private async generateAndStoreTokens(user: User | JwtUser['user']) {
    const jwtPayload: JwtUser = { user: { id: user.id, role: user.role } };

    const accessToken = await this.jwtService.signAsync(jwtPayload, { expiresIn: '15m' }); // FIXME: перенести в одно место expiresIn
    const refreshToken = await this.jwtService.signAsync(jwtPayload, { expiresIn: '30d' });

    await this.prismaService.token.create({ data: { user_id: user.id, refresh_token: refreshToken } });
    return { accessToken, refreshToken };
  }

  public hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, process.env.PASSWORD_SALT);
  }

  private comparePassword(candidatePassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hash);
  }
}
