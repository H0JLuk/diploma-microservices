import { ApiProperty } from '@nestjs/swagger';
import { TestHistoryId, UserId } from '../types';
import { AnswersToTestDto } from '../dto';

export class StartTestHistoryPayload {
  userId: UserId;
  @ApiProperty() testId: number;
}

export class FinishTestHistoryPayload {
  userId: UserId;

  testHistoryId: TestHistoryId;

  answers: AnswersToTestDto;
}

export class GetTestHistoryResultPayload {
  testHistoryId: TestHistoryId;
  userId?: UserId;
}
