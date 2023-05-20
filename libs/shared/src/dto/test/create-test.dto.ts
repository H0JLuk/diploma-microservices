import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsPositive,
} from 'class-validator';

import { CreateQuestionDto } from '../question';
import { Type } from 'class-transformer';

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
  isRandomAnswers?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @ApiProperty({ isArray: true, type: CreateQuestionDto, required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  scoreFor3: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  scoreFor4: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  scoreFor5: number;
}
