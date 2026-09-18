import { Test, TestingModule } from '@nestjs/testing';
import { RabbitsService } from './rabbits.service';

describe('RabbitsService', () => {
  let service: RabbitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitsService],
    }).compile();

    service = module.get<RabbitsService>(RabbitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
