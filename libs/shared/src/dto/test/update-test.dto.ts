import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmptyObject,
  IsArray,
} from 'class-validator';

import { CreateQuestionDto } from '../question';

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

  // @ApiProperty({ isArray: true, type: CreateQuestionDto, required: true })
  // @IsNotEmptyObject()
  // @IsArray()
  // questions: CreateQuestionDto[];
}
