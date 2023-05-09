import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTestDto, UpdateTestDto } from 'libs/shared/src/dto';
import { Test } from 'libs/shared/src/entities';

import { TestService } from './test.service';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @MessagePattern('get-tests-by-subject')
  getTestsBySubject(@Payload('subjectId') subjectId: number): Promise<Test[]> {
    return this.testService.getTestsBySubject(subjectId);
  }

  @MessagePattern('get-test')
  getTest(@Payload('testId') testId: number): Promise<Test> {
    return this.testService.getTest(testId);
  }

  @MessagePattern('get-all-tests')
  getAllTests(): Promise<Test[]> {
    return this.testService.getAllTests();
  }

  @MessagePattern('create-test')
  createTest(@Payload('test') createTestDto: CreateTestDto, @Payload('userId') userId: number) {
    try {
      return this.testService.createTest(createTestDto, userId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @MessagePattern('update-test')
  updateTest(@Payload('test') updateTestDto: UpdateTestDto, @Payload('testId') testId: number) {
    return this.testService.updateTest(updateTestDto, testId);
  }

  @MessagePattern('delete-test')
  deleteTest(@Payload('testId') testId: number) {
    return this.testService.deleteTest(testId);
  }
}
