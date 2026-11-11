import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service.js';

import { RabbitsResolver } from './rabbits.resolver.js';
import { RabbitsService } from './rabbits.service.js';
import { TraceabilityService } from './traceability.service.js';

describe('RabbitsResolver', () => {
  let resolver: RabbitsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        RabbitsResolver,
        RabbitsService,
        TraceabilityService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<RabbitsResolver>(RabbitsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
