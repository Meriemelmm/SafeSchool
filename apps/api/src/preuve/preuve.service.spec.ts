import { Test, TestingModule } from '@nestjs/testing';
import { PreuveService } from './preuve.service';

describe('PreuveService', () => {
  let service: PreuveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreuveService],
    }).compile();

    service = module.get<PreuveService>(PreuveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
