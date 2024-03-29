import { Injectable } from '@nestjs/common';
import { CreateSubjectDto, UpdateSubjectDto } from 'libs/shared/src/dto';
import { Subject } from 'libs/shared/src/entities';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getSubjects(): Promise<Subject[]> {
    const tests = await this.prismaService.testSubject.findMany({
      select: {
        id: true,
        name: true,
        tests: {
          where: { hidden: false, startTime: { gte: new Date() }, endTime: { lte: new Date() } },
          select: { id: true },
        },
      },
    });

    return tests.map(({ id, name, tests }) => ({ id, name, testsLength: tests.length }));
  }

  public getSubject(subjectId: number): Promise<Subject> {
    return this.prismaService.testSubject.findUniqueOrThrow({ where: { id: subjectId } });
  }

  public createSubject(dto: CreateSubjectDto): Promise<Subject> {
    return this.prismaService.testSubject.create({
      data: { name: dto.name },
    });
  }

  public updateSubject(dto: UpdateSubjectDto, subjectId: number): Promise<Subject> {
    return this.prismaService.testSubject.update({
      where: { id: subjectId },
      data: { name: dto.name },
    });
  }

  public async deleteSubject(subjectId: number): Promise<Subject> {
    return this.prismaService.testSubject.delete({ where: { id: subjectId } });
  }
}
