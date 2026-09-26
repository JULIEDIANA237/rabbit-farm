import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { FarmsResolver } from './farms.resolver';
import { FarmsService } from './farms.service';

describe('FarmsResolver', () => {
  let resolver: FarmsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        FarmsResolver,
        FarmsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<FarmsResolver>(FarmsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
