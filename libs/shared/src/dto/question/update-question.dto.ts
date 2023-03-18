import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { QuestionTypeEnum } from '../../entities';

export class UpdateQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ enum: QuestionTypeEnum })
  @IsOptional()
  @IsEnum(QuestionTypeEnum) // TODO: check validation
  type?: QuestionTypeEnum;
}
