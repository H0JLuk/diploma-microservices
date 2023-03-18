import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateTestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRandomAnswer?: boolean;
}
