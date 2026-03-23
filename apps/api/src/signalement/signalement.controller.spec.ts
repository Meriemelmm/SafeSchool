import { Test, TestingModule } from '@nestjs/testing';
import { SignalementController } from './signalement.controller';
import { SignalementService } from './signalement.service';

describe('SignalementController', () => {
  let controller: SignalementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignalementController],
      providers: [SignalementService],
    }).compile();

    controller = module.get<SignalementController>(SignalementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
