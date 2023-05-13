import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSubjectDto, UpdateSubjectDto } from 'libs/shared/src/dto';
import { Subject } from 'libs/shared/src/entities';

import { SubjectService } from './subject.service';

@Controller()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @MessagePattern('get-all-subjects')
  getSubjects(): Promise<Subject[]> {
    return this.subjectService.getSubjects();
  }

  @MessagePattern('get-subject')
  getSubject(@Payload('subjectId') subjectId: number): Promise<Subject> {
    return this.subjectService.getSubject(subjectId);
  }

  @MessagePattern('create-subject')
  createSubject(@Payload('subjectDto') subjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectService.createSubject(subjectDto);
  }

  @MessagePattern('update-subject')
  updateSubject(
    @Payload('subjectDto') subjectDto: UpdateSubjectDto,
    @Payload('subjectId') subjectId: number,
  ): Promise<Subject> {
    return this.subjectService.updateSubject(subjectDto, subjectId);
  }

  @MessagePattern('delete-subject')
  deleteSubject(@Payload('subjectId') subjectId: number) {
    return this.subjectService.deleteSubject(subjectId);
  }
}
