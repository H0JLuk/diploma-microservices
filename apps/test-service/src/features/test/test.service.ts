import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTestDto, UpdateTestDto } from 'libs/shared/src/dto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  public getTest(testId: number) {
    return this.prismaService.test.findUniqueOrThrow({
      where: { id: testId },
      select: {
        id: true,
        name: true,
        subject: true,
        isRandomAnswers: true,
        scoreFor3: true,
        scoreFor4: true,
        scoreFor5: true,
        creatorId: true,
        duration: true,
        startTime: true,
        endTime: true,
        subjectId: true,
        hidden: true,
        questions: {
          select: {
            id: true,
            categoryId: true,
            text: true,
            category: true,
            answers: true,
            type: true,
          },
        },
      },
    });
  }

  public async getTestsBySubject(subjectId: number) {
    return this.prismaService.test.findMany({ where: { subjectId }, include: { subject: true } });
  }

  public async getAllTests() {
    return this.prismaService.test.findMany({ include: { subject: true } });
  }

  public async createTest(dto: CreateTestDto, creatorId: number) {
    return this.prismaService.test.create({
      data: {
        creatorId,
        name: dto.name,
        endTime: dto.endTime,
        startTime: dto.startTime,
        hidden: dto.hidden,
        subjectId: dto.subjectId,
        scoreFor3: dto.scoreFor3,
        scoreFor4: dto.scoreFor4,
        scoreFor5: dto.scoreFor5,
        duration: dto.duration,
        isRandomAnswers: dto.isRandomAnswers,
        questions: {
          create: dto.questions.map((question) => ({
            categoryId: question.categoryId,
            text: question.text,
            type: question.type || 'single',
            image: question.image,
            answers: {
              create: question.answers.map((answer) => ({
                text: answer.text,
                image: answer.image,
                isRight: answer.isRight,
              })),
            },
          })),
        },
      },
    });
  }

  public async updateTest(dto: UpdateTestDto, testId: number) {
    return this.prismaService.test.update({
      where: { id: testId },
      include: { questions: { include: { answers: true } } },
      data: {
        name: dto.name,
        duration: dto.duration,
        startTime: dto.startTime,
        scoreFor3: dto.scoreFor3,
        scoreFor4: dto.scoreFor4,
        scoreFor5: dto.scoreFor5,
        endTime: dto.endTime,
        isRandomAnswers: dto.isRandomAnswers,
        hidden: dto.hidden,
        subject: { connect: { id: dto.subjectId } },
        // subjectId: { },
        // subjectId: dto.subjectId,
        // questions: {
        //   connectOrCreate: dto.questions.map((question) => ({
        //     where: { id: 'id' in question ? question.id : undefined },
        //     create: {
        //       text: question.text,
        //       type: question.type || 'single',
        //       image: question.image,
        //       answers: {
        //         connectOrCreate: question.answers?.map((answer) => ({
        //           create: { image: answer.image, isRight: answer.isRight, text: answer.text },
        //           // ({ ... true ? {  } : {} }),
        //           where: { id: 'id' in answer ? answer.id : -1 },
        //         })),
        //       },
        //     },
        //   })),
        // },
      },
    });
  }

  public async deleteTest(testId: number) {
    // TODO: если есть решения теста, то выбросить ошибку
    const foundTestHistories = await this.prismaService.testHistory.findFirst({ where: { testId } });

    if (foundTestHistories) throw new BadRequestException('Студенты уже начали выполнение теста');

    return this.prismaService.test.delete({ where: { id: testId } });
  }

  private fromArrayToObj<T extends Record<'id', string | number>>(arr: T[]) {
    return arr.reduce((acc, next) => {
      acc[next.id] = next;
      return acc;
    }, {});
  }
}
