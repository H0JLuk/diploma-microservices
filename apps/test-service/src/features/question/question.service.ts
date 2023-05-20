import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from 'libs/shared/src/dto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  public createQuestion(dto: CreateQuestionDto) {
    if (!dto.testId) {
      throw new BadRequestException('testId должен быть передан');
    }

    return this.prismaService.question.create({
      data: {
        text: dto.text,
        type: dto.type,
        image: dto.image,
        categoryId: dto.categoryId,
        testId: dto.testId,
        answers: {
          createMany: {
            data: dto.answers.map((answer) => ({
              image: answer.image,
              isRight: answer.isRight,
              text: answer.text,
            })),
          },
        },
      },
    });
  }

  public updateQuestion(dto: UpdateQuestionDto, questionId: number) {
    return this.prismaService.question.update({
      where: { id: questionId },
      data: {
        image: dto.image,
        text: dto.text,
        type: dto.type,
      },
    });
  }

  public deleteQuestion(questionId: number) {
    return this.prismaService.question.delete({ where: { id: questionId } });
  }
}
