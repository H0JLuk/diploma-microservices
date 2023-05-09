import { BadRequestException, Injectable } from '@nestjs/common';
import { TestHistoryId } from 'libs/shared/src/types';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async startTestHistory(studentId: number, testId: number) {
    const test = await this.prismaService.test.findFirstOrThrow({
      where: { id: testId, hidden: false, startTime: { gte: new Date() }, endTime: { lte: new Date() } },
      select: {
        id: true,
        name: true,
        isRandomAnswers: true,
        duration: true,
        subject: true,
        startTime: true,
        endTime: true,
        hidden: true,
        subjectId: true,
        creatorId: true,
        questions: {
          select: {
            id: true,
            category: true,
            text: true,
            type: true,
            image: true,
            categoryId: true,
            answers: {
              select: {
                id: true,
                image: true,
                text: true,
                isRight: false,
                questionId: true,
              },
            },
          },
        },
      },
    });

    const testHistory = await this.prismaService.testHistory.create({
      data: { studentId, startedAt: new Date(), testId },
    });

    return { test, testHistory };
  }

  public async selectAnswerInTestHistory(studentId: number, testId: number) {
    return [studentId, testId];
  }

  public async finishTestHistory(studentId: number, testHistoryId: TestHistoryId) {
    const testHistory = await this.prismaService.testHistory.findFirst({
      where: { studentId, id: testHistoryId, finishedAt: undefined },
    });

    if (!testHistory) {
      throw new BadRequestException('Попытка уже завершена или не найдена');
    }

    await this.prismaService.testHistory.update({
      where: { id: testHistoryId },
      data: { finishedAt: new Date() },
    });

    return [] as unknown;

    // return this.getUnhandledTestHistoryAnswers(testHistoryId);
  }

  private async getUnhandledTestHistoryAnswers(testHistoryId: TestHistoryId) {
    return this.prismaService.testHistory.findUniqueOrThrow({
      where: { id: testHistoryId },
      include: {
        test: {
          select: {
            questions: {
              select: {
                id: true,
                type: true,
                answers: { select: { id: true, isRight: true } },
              },
            },
          },
        },
        // answers: {
        //   select: {
        //     answer: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // },
      },
    });
  }

  public async getTestHistoryResult(testHistoryId: TestHistoryId) {
    const { test, ...testHistory } = await this.getUnhandledTestHistoryAnswers(testHistoryId);

    return { test, testHistory };
  }
}
