import { ApiProperty } from '@nestjs/swagger';

export class TestHistoryAnswer {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  textAnswer?: string;

  @ApiProperty()
  testHistoryId: number;

  questionId: number;

  answerId?: number;
}
