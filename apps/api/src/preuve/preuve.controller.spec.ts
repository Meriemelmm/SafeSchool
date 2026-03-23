import { Test, TestingModule } from '@nestjs/testing';
import { PreuveController } from './preuve.controller';
import { PreuveService } from './preuve.service';

describe('PreuveController', () => {
  let controller: PreuveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreuveController],
      providers: [PreuveService],
    }).compile();

    controller = module.get<PreuveController>(PreuveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
