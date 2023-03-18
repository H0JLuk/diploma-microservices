import { Controller, Delete, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorized, Roles } from 'libs/shared/src/decorators';
import { CreateAnswerDto, UpdateAnswerDto } from 'libs/shared/src/dto';
import { Answer } from 'libs/shared/src/entities';
import { Observable } from 'rxjs';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(@Inject('TEST_SERVICE') private testClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.testClient.subscribeToResponseOf('create-answers');
    this.testClient.subscribeToResponseOf('update-answers');
    this.testClient.subscribeToResponseOf('delete-answers');

    await this.testClient.connect();
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Post()
  createAnswer(@Payload() answerDto: CreateAnswerDto): Observable<Answer> {
    return this.testClient.send('create-answer', { answerDto });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Put(':id')
  updateAnswer(@Payload() answerDto: UpdateAnswerDto, @Param('id', ParseIntPipe) answerId: number): Observable<Answer> {
    return this.testClient.send('update-answer', { answerDto, answerId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Delete(':id')
  deleteAnswer(@Param('id', ParseIntPipe) answerId: number) {
    return this.testClient.send('delete-answer', { answerId });
  }
}
