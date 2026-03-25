import { Test, TestingModule } from '@nestjs/testing';
import { SignalementMemberController } from './signalement-member.controller';
import { SignalementMemberService } from './signalement-member.service';

describe('SignalementMemberController', () => {
  let controller: SignalementMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignalementMemberController],
      providers: [SignalementMemberService],
    }).compile();

    controller = module.get<SignalementMemberController>(SignalementMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
