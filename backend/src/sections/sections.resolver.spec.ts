import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { SectionsResolver } from './sections.resolver';
import { SectionsService } from './sections.service';

describe('SectionsResolver', () => {
  let resolver: SectionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        SectionsResolver,
        SectionsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<SectionsResolver>(SectionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
