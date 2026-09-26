import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { RabbitsService } from './rabbits.service';

describe('RabbitsService', () => {
  let service: RabbitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<RabbitsService>(RabbitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
