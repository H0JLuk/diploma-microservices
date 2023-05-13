import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChangeUserRoleDto, CreateUserDto } from 'libs/shared/src/dto';
import { UserId } from 'libs/shared/src/types';

import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

const userSelectFromDB = {
  id: true,
  login: true,
  name: true,
  isActivated: true,
  role: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly authService: AuthService) {}

  public getAllUsers() {
    return this.prismaService.user.findMany({
      where: { deleted: false },
      select: userSelectFromDB,
      orderBy: { id: 'asc' },
    });
  }

  public getStudents() {
    return this.prismaService.user.findMany({
      where: { deleted: false, role: 'Student' },
      select: userSelectFromDB,
      orderBy: { id: 'asc' },
    });
  }

  public async createUser(userDto: CreateUserDto): Promise<void> {
    const candidateUser = await this.prismaService.user.findUnique({ where: { login: userDto.login } });
    if (candidateUser) {
      throw new BadRequestException('User with this login is already exist');
    }

    userDto.password = await this.authService.hashPassword(userDto.password);
    await this.prismaService.user.create({ data: userDto });
  }

  public async changeUserRoleByAdmin({ role, userId }: ChangeUserRoleDto & { userId: UserId }): Promise<void> {
    if (role === 'Admin') throw new BadRequestException('Cannot give admin role');
    const candidateUser = await this.prismaService.user.findFirst({ where: { id: userId, deleted: false } });
    if (!candidateUser) throw new NotFoundException('User is not found');

    await this.prismaService.user.update({ where: { id: userId }, data: { role } });
  }

  public async banUser(userId: UserId): Promise<void> {
    await this.prismaService.user.update({ data: { deleted: true }, where: { id: userId } });
  }

  public async banStudent(studentId: UserId): Promise<void> {
    const studentCandidate = await this.prismaService.user.findFirst({ where: { id: studentId, deleted: false } });
    if (!studentCandidate) {
      throw new BadRequestException('Student is not found');
    }
    console.log('studentId :>>', studentId, studentCandidate);
    await this.prismaService.user.update({ data: { deleted: true }, where: { id: studentId } });
  }
}
