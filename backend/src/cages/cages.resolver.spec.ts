import { Test, TestingModule } from '@nestjs/testing';
import { CagesResolver } from './cages.resolver';

describe('CagesResolver', () => {
  let resolver: CagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CagesResolver],
    }).compile();

    resolver = module.get<CagesResolver>(CagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
