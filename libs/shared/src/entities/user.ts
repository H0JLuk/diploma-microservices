import { ApiProperty } from '@nestjs/swagger';
import { UserId } from '../types';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  isActivated: boolean;

  @ApiProperty()
  role: UserRoles;

  @ApiProperty()
  deleted?: boolean;

  password?: string;
}

export type JwtUser = {
  user: {
    id: UserId;
    role: User['role'];
  };
};

export type JwtInfo = JwtUser & {
  iat: number;
  exp: number;
};

export type UserRoles = 'Student' | 'Methodist' | 'Admin';
export enum UserRoleEnum {
  Student,
  Methodist,
  Admin,
}
