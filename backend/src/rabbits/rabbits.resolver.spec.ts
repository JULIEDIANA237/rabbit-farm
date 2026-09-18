import { Test, TestingModule } from '@nestjs/testing';
import { RabbitsResolver } from './rabbits.resolver';

describe('RabbitsResolver', () => {
  let resolver: RabbitsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitsResolver],
    }).compile();

    resolver = module.get<RabbitsResolver>(RabbitsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
