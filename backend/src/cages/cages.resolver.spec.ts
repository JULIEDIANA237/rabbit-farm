import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service.js';

import { CagesResolver } from './cages.resolver.js';
import { CagesService } from './cages.service.js';

describe('CagesResolver', () => {
  let resolver: CagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        CagesResolver,
        CagesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<CagesResolver>(CagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
