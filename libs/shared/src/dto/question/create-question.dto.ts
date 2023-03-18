import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmptyObject, IsArray, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { QuestionTypeEnum } from '../../entities';

import { CreateAnswerDto } from '../answer';

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
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ isArray: true, type: CreateAnswerDto })
  @IsNotEmptyObject()
  @IsArray()
  answers: CreateAnswerDto[];
}
