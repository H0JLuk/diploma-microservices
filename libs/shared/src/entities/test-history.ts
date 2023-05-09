import { ApiProperty } from '@nestjs/swagger';

export class TestHistory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty({ required: false })
  finishedAt?: Date;

  @ApiProperty()
  studentId: number;
}
