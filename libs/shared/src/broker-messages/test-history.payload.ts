import { ApiProperty } from '@nestjs/swagger';
import { TestHistoryId, UserId } from '../types';

export class StartTestHistoryPayload {
  userId: UserId;
  @ApiProperty() testId: number;
}

export class FinishTestHistoryPayload {
  userId: UserId;
  @ApiProperty() testHistoryId: TestHistoryId;
}

export class GetTestHistoryResultPayload {
  @ApiProperty() testHistoryId: TestHistoryId;
}
