import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { QuestionTypeEnum } from '../../entities';
import { Type } from 'class-transformer';
import { CreateAnswerDto, UpdateAnswerDto } from '../answer';

export class UpdateQuestionDto {
  id?: number;

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

  @ApiProperty({ isArray: true, type: [CreateAnswerDto, UpdateAnswerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @Type(() => UpdateAnswerDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: CreateAnswerDto, name: 'CreateAnswerDto' },
        { value: UpdateAnswerDto, name: 'UpdateAnswerDto' },
      ],
    },
  })
  answers?: Array<CreateAnswerDto | UpdateAnswerDto>;
}
