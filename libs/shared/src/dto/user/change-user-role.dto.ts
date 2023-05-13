import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User, UserRoleEnum } from '../../entities';

export class ChangeUserRoleDto {
  @ApiProperty()
  @IsString()
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: User['role'];
}
