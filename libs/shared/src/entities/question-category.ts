import { ApiProperty } from '@nestjs/swagger';

import { Question } from './question';

export class QuestionCategory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  questions?: Question[];
}
