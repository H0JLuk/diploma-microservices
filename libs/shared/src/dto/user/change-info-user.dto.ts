import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class ChangeInfoUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 1,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  @IsOptional()
  newPassword: string;
}
