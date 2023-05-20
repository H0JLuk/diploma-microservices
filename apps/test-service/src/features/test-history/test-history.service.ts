import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AnswersToTestDto } from 'libs/shared/src/dto';
import { TestHistoryId, UserId } from 'libs/shared/src/types';

import { PrismaService } from '../prisma/prisma.service';
import { getTestFieldsForStudent } from './test-history.selectors';

@Injectable()
export class TestHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async startTestHistory(studentId: number, testId: number) {
    const test = await this.prismaService.test.findFirst({
      where: { id: testId /* hidden: false, startTime: { gte: new Date() }, endTime: { lte: new Date() }*/ },
      select: getTestFieldsForStudent,
    });
    if (!test) throw new NotFoundException('Тест не найден');

    const startedTestHistory = await this.prismaService.testHistory.findFirst({ where: { studentId, testId } });

    if (startedTestHistory) {
      if (startedTestHistory.finishedAt) {
        throw new BadRequestException('Тест уже был завершен');
      }
      return { test, testHistory: startedTestHistory };
    }

    const testHistory = await this.prismaService.testHistory.create({
      data: { studentId, startedAt: new Date(), testId },
    });

    return { test, testHistory };
  }

  public async getTestHistoriesByStudent(studentId: UserId) {
    const testsHistories = await this.prismaService.testHistory.findMany({
      where: { studentId },
      include: { test: true },
    });
    return testsHistories.map(({ test, ...testHistory }) => ({ test, testHistory }));
  }

  public async getTestHistory(id: number, studentId: UserId) {
    const testHistory = await this.prismaService.testHistory.findFirst({ where: { id, finishedAt: null, studentId } });
    if (!testHistory) throw new NotFoundException('Попытка теста не найдена');
    const test = await this.prismaService.test.findUniqueOrThrow({
      where: { id: testHistory.testId },
      select: getTestFieldsForStudent,
    });
    if (!test) throw new NotFoundException('Тест не найден');

    return { test, testHistory };
  }

  public async getTestStatsByUser(studentId: UserId) {
    // const testHistories = await this.prismaService.testHistory.findFirst

    const tests = await this.prismaService.test.findMany({
      where: { testHistories: { some: { studentId } } },
      include: {
        questions: {
          include: { answers: true, testHistoryAnswer: true },
        },
      },
    });

    const markCount = { 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const test of tests) {
      const totalRightPoints = test.questions.reduce((points, question) => {
        if (question.type === 'input') {
          const isRight = question.testHistoryAnswer[0].textAnswer === question.answers[0].text;
          isRight && points++;
        } else if (question.type === 'single') {
          const isRight = question.answers.some(
            (answer) => answer.isRight && answer.id === question.testHistoryAnswer[0].answerId,
          );
          isRight && points++;
        } else {
          throw new BadRequestException('Недоступный тип вопроса');
        }

        return points;
      }, 0);

      const mark = (() => {
        if (totalRightPoints >= test.scoreFor5) return 5;
        if (totalRightPoints >= test.scoreFor4) return 4;
        if (totalRightPoints >= test.scoreFor3) return 3;
        return 2;
      })();
      // eslint-disable-next-line security/detect-object-injection
      markCount[mark]++;
    }

    return markCount;
  }

  public async finishTestHistory(
    studentId: number,
    testHistoryId: TestHistoryId,
    answers: AnswersToTestDto,
  ): Promise<void> {
    const testHistory = await this.prismaService.testHistory.findFirst({
      where: { studentId, id: testHistoryId, finishedAt: null },
    });

    if (!testHistory) {
      throw new BadRequestException('Попытка уже завершена или не найдена');
    }

    await this.prismaService.testHistoryAnswer.createMany({
      data: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: +questionId,
        answerId: 'answerId' in answer ? answer.answerId : undefined,
        textAnswer: 'answer' in answer ? answer.answer.trim() : undefined,
        testHistoryId,
      })),
    });

    await this.prismaService.testHistory.update({
      where: { id: testHistoryId },
      data: { finishedAt: new Date() },
    });
  }

  public async getTestHistoryResult(testHistoryId: TestHistoryId, studentId?: UserId) {
    const { test, ...testHistory } = await this.prismaService.testHistory.findFirst({
      where: { id: testHistoryId, studentId },
      include: {
        test: {
          include: {
            questions: {
              include: {
                answers: true,
                testHistoryAnswer: { where: { testHistoryId } },
              },
            },
          },
        },
      },
    });

    const totalRightPoints = test.questions.reduce((points, question) => {
      if (question.type === 'input') {
        const isRight = question.testHistoryAnswer[0].textAnswer === question.answers[0].text;
        isRight && points++;
      } else if (question.type === 'single') {
        const isRight = question.answers.some(
          (answer) => answer.isRight && answer.id === question.testHistoryAnswer[0].answerId,
        );
        isRight && points++;
      } else {
        throw new BadRequestException('Недоступный тип вопроса');
      }

      return points;
    }, 0);

    const mark = (() => {
      if (totalRightPoints >= test.scoreFor5) return 5;
      if (totalRightPoints >= test.scoreFor4) return 4;
      if (totalRightPoints >= test.scoreFor3) return 3;
      return 2;
    })();

    return { test, testHistory, totalRightPoints, mark };
  }
}
