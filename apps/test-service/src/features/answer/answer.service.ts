import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAnswerDto, UpdateAnswerDto } from 'libs/shared/src/dto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private readonly prismaService: PrismaService) {}

  public createAnswer(dto: CreateAnswerDto) {
    if (!dto.questionId) {
      throw new BadRequestException('questionId должен быть передан');
    }

    return this.prismaService.answerToQuestion.create({
      data: {
        text: dto.text,
        image: dto.image,
        isRight: dto.isRight,
        questionId: dto.questionId,
      },
    });
  }

  public updateAnswer(dto: UpdateAnswerDto, answerId: number) {
    return this.prismaService.answerToQuestion.update({
      where: { id: answerId },
      data: {
        image: dto.image,
        text: dto.text,
        isRight: dto.isRight,
      },
    });
  }

  public deleteAnswer(answerId: number) {
    return this.prismaService.answerToQuestion.delete({ where: { id: answerId } });
  }
}
