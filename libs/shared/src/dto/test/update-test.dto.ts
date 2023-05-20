import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto, UpdateQuestionDto } from '../question';

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
  hidden?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRandomAnswers?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @ApiProperty({ isArray: true, type: [CreateQuestionDto, UpdateQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @Type(() => UpdateQuestionDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: CreateQuestionDto, name: 'CreateQuestionDto' },
        { value: UpdateQuestionDto, name: 'UpdateQuestionDto' },
      ],
    },
  })
  questions: Array<CreateQuestionDto | UpdateQuestionDto>;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  scoreFor3?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  scoreFor4?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  scoreFor5?: number;
}
