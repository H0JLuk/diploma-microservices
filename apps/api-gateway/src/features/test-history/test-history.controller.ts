import { Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  FinishTestHistoryPayload,
  GetTestHistoryResultPayload,
  StartTestHistoryPayload,
} from 'libs/shared/src/broker-messages';
import { Authorized, CurrentUser, Roles } from 'libs/shared/src/decorators';
import { AnswersToTestDto } from 'libs/shared/src/dto';
import { JwtUser } from 'libs/shared/src/entities';
import { TestHistoryId, UserId } from 'libs/shared/src/types';
import { Observable } from 'rxjs';

@ApiTags('test-history')
@Controller('test-history')
export class TestHistoryController {
  constructor(@Inject('TEST_SERVICE') private testClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.testClient.subscribeToResponseOf('start-test-history');
    this.testClient.subscribeToResponseOf('get-test-history');
    this.testClient.subscribeToResponseOf('end-test-history');
    this.testClient.subscribeToResponseOf('get-test-history-result');
    this.testClient.subscribeToResponseOf('get-test-stats-by-user');
    // eslint-disable-next-line sonarjs/no-duplicate-string
    this.testClient.subscribeToResponseOf('get-test-histories-by-student');

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
  @Roles('Methodist', 'Admin')
  @Get('users/:id')
  getTestHistoriesByStudent(@Param('id', ParseIntPipe) studentId: UserId) {
    return this.testClient.send('get-test-histories-by-student', { studentId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Get()
  getTestHistories(@CurrentUser('id') userId: UserId) {
    return this.testClient.send('get-test-histories-by-student', { studentId: userId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Get('stats/users/:id')
  getTestStatsByUser(@Param('id', ParseIntPipe) studentId: UserId) {
    return this.testClient.send('get-test-stats-by-user', { studentId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Get(':id')
  getTestHistory(@Param('id', ParseIntPipe) id: TestHistoryId, @CurrentUser('id') studentId: UserId) {
    return this.testClient.send('get-test-history', { id, studentId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Post('finish/:id')
  finishTestHistory(
    @Param('id', ParseIntPipe) testHistoryId: TestHistoryId,
    @CurrentUser('id') userId: UserId,
    @Payload() answers: AnswersToTestDto,
  ): Observable<void> {
    const payload: FinishTestHistoryPayload = { testHistoryId, userId, answers };
    return this.testClient.send('end-test-history', payload);
  }

  @ApiBearerAuth()
  @Authorized()
  @Get('result/:id')
  getTestHistoryResult(@Param('id', ParseIntPipe) testHistoryId: TestHistoryId, @CurrentUser() user: JwtUser['user']) {
    const isStudent = user.role === 'Student';
    const studentId = isStudent ? user.id : undefined; // prevent get test of another users

    const payload: GetTestHistoryResultPayload = {
      testHistoryId,
      userId: studentId,
    };
    return this.testClient.send('get-test-history-result', payload);
  }
}
