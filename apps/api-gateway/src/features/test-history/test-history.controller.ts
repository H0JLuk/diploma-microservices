import { Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  FinishTestHistoryPayload,
  GetTestHistoryResultPayload,
  StartTestHistoryPayload,
} from 'libs/shared/src/broker-messages';
import { Authorized, CurrentUser } from 'libs/shared/src/decorators';
import { CreateTestDto, UpdateTestDto } from 'libs/shared/src/dto';
import { Test, TestHistory } from 'libs/shared/src/entities';
import { TestHistoryId, UserId } from 'libs/shared/src/types';

@ApiTags('test-history')
@Controller('test-history')
export class TestHistoryController {
  constructor(@Inject('TEST_SERVICE') private testClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.testClient.subscribeToResponseOf('start-test-history');
    this.testClient.subscribeToResponseOf('end-test-history');
    this.testClient.subscribeToResponseOf('get-test-history-result');

    await this.testClient.connect();
  }

  @ApiBearerAuth()
  @Authorized()
  @Post('start')
  startTestHistory(@CurrentUser('id') userId: UserId, @Payload() { testId }: StartTestHistoryPayload) {
    const payload: StartTestHistoryPayload = { testId, userId };
    return this.testClient.send('start-test-history', payload);
  }

  @ApiBearerAuth()
  @Authorized()
  @Post('finish/:id')
  finishTestHistory(@Param('id', ParseIntPipe) testHistoryId: TestHistoryId, @CurrentUser('id') userId: UserId) {
    const payload: FinishTestHistoryPayload = { testHistoryId, userId };
    return this.testClient.send('end-test-history', payload);
  }

  @ApiBearerAuth()
  @Authorized()
  @Get(':id')
  getTestHistoryResult(@Param('id', ParseIntPipe) testHistoryId: TestHistoryId) {
    const payload: GetTestHistoryResultPayload = { testHistoryId };
    return this.testClient.send('get-test-history-result', payload);
  }
}
