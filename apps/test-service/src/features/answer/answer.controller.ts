import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAnswerDto, UpdateAnswerDto } from 'libs/shared/src/dto';
import { Answer } from 'libs/shared/src/entities';

import { AnswerService } from './answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @MessagePattern('create-answer')
  createAnswer(@Payload('answerDto') answerDto: CreateAnswerDto): Promise<Answer> {
    return this.answerService.createAnswer(answerDto);
  }

  @MessagePattern('update-answer')
  updateAnswer(
    @Payload('answerDto') answerDto: UpdateAnswerDto,
    @Payload('answerId') answerId: number,
  ): Promise<Answer> {
    return this.answerService.updateAnswer(answerDto, answerId);
  }

  @MessagePattern('delete-answer')
  deleteAnswer(@Payload('answerId') answerId: number) {
    return this.answerService.deleteAnswer(answerId);
  }
}
