import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  FinishTestHistoryPayload,
  GetTestHistoryResultPayload,
  StartTestHistoryPayload,
} from 'libs/shared/src/broker-messages';
import { Test, TestHistory } from 'libs/shared/src/entities';

import { TestHistoryService } from './test-history.service';

@Controller()
export class TestHistoryController {
  constructor(private readonly testHistoryService: TestHistoryService) {}

  @MessagePattern('start-test-history')
  startTestHistory(@Payload() payload: StartTestHistoryPayload): Promise<{ test: Test; testHistory: TestHistory }> {
    const { userId, testId } = payload;
    return this.testHistoryService.startTestHistory(userId, testId);
  }

  @MessagePattern('end-test-history')
  finishTestHistory(@Payload() payload: FinishTestHistoryPayload): Promise<unknown> {
    const { userId, testHistoryId } = payload;
    return this.testHistoryService.finishTestHistory(userId, testHistoryId);
  }

  @MessagePattern('get-test-history-result')
  getTestHistoryResult(@Payload() payload: GetTestHistoryResultPayload) {
    const { testHistoryId } = payload;
    return this.testHistoryService.getTestHistoryResult(testHistoryId);
  }
}
