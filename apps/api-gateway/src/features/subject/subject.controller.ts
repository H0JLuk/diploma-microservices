import { Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorized, Roles } from 'libs/shared/src/decorators';
import { CreateSubjectDto, UpdateSubjectDto } from 'libs/shared/src/dto';
import { Subject } from 'libs/shared/src/entities';
import { Observable } from 'rxjs';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectController {
  constructor(@Inject('TEST_SERVICE') private testClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.testClient.subscribeToResponseOf('get-all-subjects');
    this.testClient.subscribeToResponseOf('create-subject');
    this.testClient.subscribeToResponseOf('update-subject');
    this.testClient.subscribeToResponseOf('delete-subject');

    await this.testClient.connect();
  }

  @ApiBearerAuth()
  @Authorized()
  @Get()
  getSubjects(): Observable<Subject[]> {
    return this.testClient.send('get-all-subjects', '');
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Post()
  createSubject(@Payload() subjectDto: CreateSubjectDto): Observable<Subject> {
    return this.testClient.send('create-subject', { subjectDto });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Put(':id')
  updateSubject(
    @Payload() subjectDto: UpdateSubjectDto,
    @Param('id', ParseIntPipe) subjectId: number,
  ): Observable<Subject> {
    return this.testClient.send('update-subject', { subjectDto, subjectId });
  }

  @ApiBearerAuth()
  @Authorized()
  @Roles('Methodist', 'Admin')
  @Delete(':id')
  deleteSubject(@Param('id', ParseIntPipe) subjectId: number) {
    return this.testClient.send('delete-subject', { subjectId });
  }
}
