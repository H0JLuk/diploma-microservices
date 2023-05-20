import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  FinishTestHistoryPayload,
  GetTestHistoryResultPayload,
  StartTestHistoryPayload,
} from 'libs/shared/src/broker-messages';
import { Test, TestHistory } from 'libs/shared/src/entities';
import { UserId } from 'libs/shared/src/types';

import { TestHistoryService } from './test-history.service';

@Controller()
export class TestHistoryController {
  constructor(private readonly testHistoryService: TestHistoryService) {}

  @MessagePattern('start-test-history')
  startTestHistory(@Payload() payload: StartTestHistoryPayload): Promise<{ test: Test; testHistory: TestHistory }> {
    const { userId, testId } = payload;
    return this.testHistoryService.startTestHistory(userId, testId);
  }

  @MessagePattern('get-test-histories-by-student')
  getTestHistoriesByStudent(
    @Payload('studentId') studentId: number,
  ): Promise<Array<{ test: Test; testHistory: TestHistory }>> {
    return this.testHistoryService.getTestHistoriesByStudent(studentId);
  }

  @MessagePattern('get-test-history')
  getTestHistory(
    @Payload('id') id: number,
    @Payload('studentId') studentId: UserId,
  ): Promise<{ test: Test; testHistory: TestHistory }> {
    return this.testHistoryService.getTestHistory(id, studentId);
  }

  @MessagePattern('get-test-stats-by-user')
  getTestStatsByUser(@Payload('studentId') studentId: UserId) {
    return this.testHistoryService.getTestStatsByUser(studentId);
  }

  @MessagePattern('end-test-history')
  finishTestHistory(@Payload() payload: FinishTestHistoryPayload): Promise<void> {
    const { userId, testHistoryId, answers } = payload;
    return this.testHistoryService.finishTestHistory(userId, testHistoryId, answers);
  }

  @MessagePattern('get-test-history-result')
  getTestHistoryResult(@Payload() payload: GetTestHistoryResultPayload) {
    const { testHistoryId, userId } = payload;
    return this.testHistoryService.getTestHistoryResult(testHistoryId, userId);
  }
}
