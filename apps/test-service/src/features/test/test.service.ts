import { Injectable } from '@nestjs/common';
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
        subjectId: dto.subjectId,
        duration: dto.duration,
        isRandomAnswers: dto.isRandomAnswer,
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
      data: {
        name: dto.name,
        duration: dto.duration,
        startTime: dto.startTime,
        endTime: dto.endTime,
        isRandomAnswers: dto.isRandomAnswer,
      },
    });
  }

  public async deleteTest(testId: number) {
    // TODO: если есть решения теста, то выбросить ошибку

    return this.prismaService.test.delete({ where: { id: testId } });
  }
}
