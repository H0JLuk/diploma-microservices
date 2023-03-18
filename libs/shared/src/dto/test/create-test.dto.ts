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

export class CreateTestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRandomAnswer?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @ApiProperty({ isArray: true, type: CreateQuestionDto, required: true })
  @IsNotEmptyObject()
  @IsArray()
  questions: CreateQuestionDto[];
}
