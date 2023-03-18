import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateQuestionDto, UpdateQuestionDto } from 'libs/shared/src/dto';
import { Question } from 'libs/shared/src/entities';

import { QuestionService } from './question.service';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @MessagePattern('create-question')
  createQuestion(@Payload('questionDto') questionDto: CreateQuestionDto): Promise<Question> {
    return this.questionService.createQuestion(questionDto);
  }

  @MessagePattern('update-question')
  updateQuestion(
    @Payload('questionDto') questionDto: UpdateQuestionDto,
    @Payload('questionId') questionId: number,
  ): Promise<Question> {
    return this.questionService.updateQuestion(questionDto, questionId);
  }

  @MessagePattern('delete-question')
  deleteQuestion(@Payload('questionId') questionId: number) {
    return this.questionService.deleteQuestion(questionId);
  }
}
