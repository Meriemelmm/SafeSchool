import { Test, TestingModule } from '@nestjs/testing';
import { SignalementMemberService } from './signalement-member.service';

describe('SignalementMemberService', () => {
  let service: SignalementMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignalementMemberService],
    }).compile();

    service = module.get<SignalementMemberService>(SignalementMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
