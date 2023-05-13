import { ApiProperty } from '@nestjs/swagger';

import { Test } from '.';

export class Subject {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  tests?: Test[];

  @ApiProperty({ required: false })
  testsLength?: number;
}
