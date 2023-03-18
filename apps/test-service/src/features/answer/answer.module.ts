import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  imports: [PrismaModule],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
