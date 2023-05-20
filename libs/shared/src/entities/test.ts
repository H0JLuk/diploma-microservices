import { ApiProperty } from '@nestjs/swagger';

import { Question } from './question';
import { Subject } from './subject';

export class Test {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty({ required: false, description: 'Test is available for so many minutes' })
  duration?: number;

  @ApiProperty()
  isRandomAnswers: boolean;

  @ApiProperty()
  hidden: boolean; // FIXME: почему-то на required ругается

  @ApiProperty({ required: false })
  subject?: Subject;

  @ApiProperty()
  subjectId: number;

  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  questions?: Question[];

  @ApiProperty({ required: false })
  scoreFor3?: number;

  @ApiProperty({ required: false })
  scoreFor4?: number;

  @ApiProperty({ required: false })
  scoreFor5?: number;
}
