import { Test, TestingModule } from '@nestjs/testing';
import { S3ResourcesService } from './s3-resources.service';

describe('S3ResourcesService', () => {
  let service: S3ResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3ResourcesService],
    }).compile();

    service = module.get<S3ResourcesService>(S3ResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
