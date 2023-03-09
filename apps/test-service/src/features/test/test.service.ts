import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllTests() {
    return this.prismaService.test.findMany({
      include: { subject: true },
      orderBy: { subject: { name: 'asc' } },
    });
  }
}
