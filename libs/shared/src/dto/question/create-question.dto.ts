import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmptyObject,
  IsArray,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { QuestionTypeEnum } from '../../entities';

import { CreateAnswerDto } from '../answer';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ enum: QuestionTypeEnum })
  @IsEnum(QuestionTypeEnum) // TODO: check validation
  type: QuestionTypeEnum;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  testId?: number;

  @ApiProperty({ isArray: true, type: CreateAnswerDto })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
