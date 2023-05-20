import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeUserRoleDto, CreateUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';
import { UserId } from 'libs/shared/src/types';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly authService: UserService) {}

  @MessagePattern('get-all-users')
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @MessagePattern('get-user')
  getUser(@Payload('userId') userId: UserId): Promise<User> {
    return this.authService.getUser(userId);
  }

  @MessagePattern('get-students')
  getStudents(): Promise<User[]> {
    return this.authService.getStudents();
  }

  @MessagePattern('create-user')
  async createUser(@Payload() user: CreateUserDto): Promise<void> {
    return this.authService.createUser(user);
  }

  @MessagePattern('change-user-role-by-admin')
  async changeUserRoleByAdmin(@Payload() dto: ChangeUserRoleDto & { userId: UserId }): Promise<void> {
    return this.authService.changeUserRoleByAdmin(dto);
  }

  @MessagePattern('ban-user')
  async banUser(@Payload('userId') userId: UserId): Promise<void> {
    return this.authService.banUser(userId);
  }

  @MessagePattern('ban-student')
  async banStudent(@Payload('userId') studentId: UserId): Promise<void> {
    return this.authService.banStudent(studentId);
  }
}
