import { Controller, Delete, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorized, Roles } from 'libs/shared/src/decorators';
import { CreateQuestionDto, UpdateQuestionDto } from 'libs/shared/src/dto';
import { Test } from 'libs/shared/src/entities';
import { Observable } from 'rxjs';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(@Inject('TEST_SERVICE') private testClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.testClient.subscribeToResponseOf('create-question');
    this.testClient.subscribeToResponseOf('update-question');
    this.testClient.subscribeToResponseOf('delete-question');

    await this.testClient.connect();
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Post()
  createQuestion(@Payload() questionDto: CreateQuestionDto): Observable<Test> {
    return this.testClient.send('create-question', { questionDto });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Put(':id')
  updateQuestion(
    @Payload() questionDto: UpdateQuestionDto,
    @Param('id', ParseIntPipe) questionId: number,
  ): Observable<Test> {
    return this.testClient.send('update-question', { questionDto, questionId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Delete(':id')
  deleteQuestion(@Param('id', ParseIntPipe) questionId: number) {
    return this.testClient.send('delete-question', { questionId });
  }
}
