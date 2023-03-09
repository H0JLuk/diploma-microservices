import { ApiProperty } from '@nestjs/swagger';

export class Test {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty({ required: false, description: 'Test is available for so many minutes' })
  duration: number;

  @ApiProperty()
  isRandomAnswers: boolean;
}
