import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TestHistoryController } from './test-history.controller';
import { TestHistoryService } from './test-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [TestHistoryController],
  providers: [TestHistoryService],
})
export class TestHistoryModule {}
