import { ApiProperty } from '@nestjs/swagger';
import { Question } from './question';

export class Answer {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  isRight?: boolean;

  @ApiProperty()
  questionId: number;

  @ApiProperty()
  question?: Question;
}
