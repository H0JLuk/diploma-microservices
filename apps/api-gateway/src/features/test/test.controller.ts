import { Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorized, CurrentUser, Roles, TCurrentUser } from 'libs/shared/src/decorators';
import { CreateTestDto, UpdateTestDto } from 'libs/shared/src/dto';
import { Test } from 'libs/shared/src/entities';
import { Observable } from 'rxjs';

@ApiTags('tests')
@Controller('tests')
export class TestController {
  constructor(@Inject('TEST_SERVICE') private testClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.testClient.subscribeToResponseOf('create-test');
    this.testClient.subscribeToResponseOf('update-test');
    this.testClient.subscribeToResponseOf('delete-test');
    this.testClient.subscribeToResponseOf('get-tests-by-subject');
    this.testClient.subscribeToResponseOf('get-all-tests');
    this.testClient.subscribeToResponseOf('get-test');

    await this.testClient.connect();
  }

  @ApiBearerAuth()
  @Authorized()
  @Get()
  getAllTests() {
    return this.testClient.send('get-all-tests', '');
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Get(':id')
  getTest(@Param('id', ParseIntPipe) testId: number) {
    return this.testClient.send('get-test', { testId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Get('subject/:subjectId')
  getAllTestsBySubject(@Param('subjectId', ParseIntPipe) subjectId: number): Observable<Test> {
    return this.testClient.send('get-tests-by-subject', { subjectId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Post()
  createTest(@Payload() createTestDto: CreateTestDto, @CurrentUser('id') userId: TCurrentUser['id']): Observable<Test> {
    return this.testClient.send('create-test', { test: createTestDto, userId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Put(':id')
  updateTest(@Param('id', ParseIntPipe) testId: string, @Payload() updateTestDto: UpdateTestDto): Observable<Test> {
    return this.testClient.send('update-test', { test: updateTestDto, testId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Delete(':id')
  deleteTest(@Param('id') testId: string): Observable<Test> {
    return this.testClient.send('delete-test', { testId });
  }
}
