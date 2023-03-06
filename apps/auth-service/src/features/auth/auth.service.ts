import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, RegistrationUserDto } from 'libs/shared/src/dto';
import { JwtInfo, JwtUser, User } from 'libs/shared/src/entities';

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

  getAllUsers() {
    return this.prismaService.user.findMany({ select: userSelectFromDB });
  }

  async registration({ login, name, password }: RegistrationUserDto) {
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
    const foundUser = await this.prismaService.user.findUnique({
      where: { login },
      select: { ...userSelectFromDB, password: true },
    });

    if (!foundUser) {
      throw new BadRequestException('Пользователя с таким логином не существует!');
    }

    const { password: hashPassword, ...user } = foundUser;

    const isEquals = await bcrypt.compare(password, hashPassword);

    if (!isEquals) {
      throw new BadRequestException('Неправильный пароль');
    }

    const { accessToken, refreshToken } = await this.generateAndStoreTokens(user);
    return { user, accessToken, refreshToken };
  }

  public async verifyJwt(jwtToken: string) {
    try {
      const { user } = await this.jwtService.verifyAsync<JwtInfo>(jwtToken);
      return { user };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async getUserFromHeader(jwt: string): Promise<JwtInfo> {
    if (!jwt) return;

    try {
      return this.jwtService.decode(jwt) as JwtInfo;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async generateAndStoreTokens(user: User) {
    const jwtPayload: JwtUser = { user: { id: user.id, role: user.role } };

    const accessToken = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync(jwtPayload);

    await this.prismaService.token.create({ data: { user_id: user.id, refresh_token: refreshToken } });
    return { accessToken, refreshToken };
  }
}
