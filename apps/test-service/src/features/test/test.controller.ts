import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {} from 'libs/shared/src/dto';
import { Test } from 'libs/shared/src/entities';

import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @MessagePattern('get-all-tests')
  getAllUsers(): Promise<Test[]> {
    return this.testService.getAllTests();
  }
}
