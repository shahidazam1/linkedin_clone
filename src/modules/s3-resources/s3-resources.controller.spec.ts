import { Test, TestingModule } from '@nestjs/testing';
import { S3ResourcesController } from './s3-resources.controller';

describe('S3ResourcesController', () => {
  let controller: S3ResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3ResourcesController],
    }).compile();

    controller = module.get<S3ResourcesController>(S3ResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
