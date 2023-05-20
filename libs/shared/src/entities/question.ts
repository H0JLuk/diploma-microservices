import { ApiProperty } from '@nestjs/swagger';
import { Answer } from './answer';

import { QuestionCategory } from './question-category';
import { TestHistoryAnswer } from './test-history-answer';

export class Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  type: keyof typeof QuestionTypeEnum;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  category?: QuestionCategory;

  @ApiProperty()
  answers?: Answer[];

  @ApiProperty({ required: false })
  testHistoryAnswer?: TestHistoryAnswer[];
}

export enum QuestionTypeEnum {
  single = 'single',
  multiple = 'multiple',
  input = 'input',
}
