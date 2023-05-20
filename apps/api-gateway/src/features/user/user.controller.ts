import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorized, Roles } from 'libs/shared/src/decorators';
import { ChangeUserRoleDto, CreateUserDto } from 'libs/shared/src/dto';
import { User } from 'libs/shared/src/entities';
import { UserId } from 'libs/shared/src/types';
import { Observable } from 'rxjs';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.authClient.subscribeToResponseOf('get-all-users');
    this.authClient.subscribeToResponseOf('get-user');
    this.authClient.subscribeToResponseOf('get-students');
    this.authClient.subscribeToResponseOf('create-user');
    this.authClient.subscribeToResponseOf('change-user-role-by-admin');
    this.authClient.subscribeToResponseOf('ban-user');
    this.authClient.subscribeToResponseOf('ban-student');

    await this.authClient.connect();
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin')
  @Get()
  getUsers(): Observable<User[]> {
    return this.authClient.send('get-all-users', '');
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin', 'Methodist')
  @Get('students')
  getStudents(): Observable<User[]> {
    return this.authClient.send('get-students', '');
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin', 'Methodist')
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) userId: UserId): Observable<User> {
    return this.authClient.send('get-user', { userId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin')
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Observable<void> {
    return this.authClient.send('create-user', createUserDto);
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin')
  @Put(':id')
  changeUserRole(
    @Param('id', ParseIntPipe) userId: UserId,
    @Body() changeUserRoleDto: ChangeUserRoleDto,
  ): Observable<void> {
    return this.authClient.send('change-user-role-by-admin', { userId, ...changeUserRoleDto });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin')
  @Post('ban-user/:id')
  banUser(@Param('id', ParseIntPipe) userId: UserId): Observable<void> {
    return this.authClient.send('ban-user', { userId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Admin', 'Methodist')
  @Post('students/ban-user/:id')
  banStudent(@Param('id', ParseIntPipe) userId: UserId): Observable<void> {
    return this.authClient.send('ban-student', { userId });
  }
}
