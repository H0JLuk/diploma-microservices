import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User, UserRoleEnum } from '../../entities';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: User['name'];

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  login: User['login'];

  @ApiProperty()
  @IsString()
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: User['role'];

  @ApiProperty()
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 1,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  @IsNotEmpty()
  password: User['password'];
}
