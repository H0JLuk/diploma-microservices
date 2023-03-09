import { ApiProperty } from '@nestjs/swagger';

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
}

export type JwtUser = {
  user: {
    id: User['id'];
    role: User['role'];
  };
};

export type JwtInfo = JwtUser & {
  iat: number;
  exp: number;
};

export type UserRoles = 'Student' | 'Methodist' | 'Admin';
